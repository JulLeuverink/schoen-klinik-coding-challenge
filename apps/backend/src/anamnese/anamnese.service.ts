import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditService } from 'src/audit/audit.service';
import { AnamneseAction } from 'src/common/enums/anamneseAction';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';
import { DAY } from 'src/common/utils/dateUtils';
import { Anamnese } from './anamnese';
import { AnamneseDocument, AnamneseDocumentType } from './anamnese.document';
import { CreateAnamneseInput } from './create-anamnese.input';
import { StatusService } from './status/status.service';
import { getAvailableActions } from './status/transition.type';
import { SubmissionResult } from './submissionResult';
import { VerificationResult } from './verify-anamnese/verification-result';

@Injectable()
export class AnamneseService {
    constructor(
        @InjectModel(AnamneseDocument.name)
        private anamneseModel: Model<AnamneseDocumentType>,
        private auditService: AuditService,
        private statusService: StatusService,
    ) {}

    private readonly NOT_FOUND_TEXT =
        'Anamnese konnte nicht gefunden werden. Id: ';
    private readonly VERIFICATION_LINK_BASE =
        'http://localhost:4200/anamnese/bestaetigung/';

    private mapAnamneseDoc(doc: AnamneseDocumentType): Anamnese {
        return {
            id: doc._id.toString(),
            status: doc.status,
            firstName: doc.firstName,
            lastName: doc.lastName,
            dateOfBirth: doc.dateOfBirth,
            email: doc.email,
            signatureConfirmed: doc.signatureConfirmed,
            complaintsAndOnset: doc.complaintsAndOnset,
            workplaceAccident: doc.workplaceAccident,
            workplaceAccidentDetails: doc.workplaceAccidentDetails,
            preExistingConditions: doc.preExistingConditions,
            primaryCarePhysician: doc.primaryCarePhysician,
            medications: doc.medications,
            emailVerificationToken: doc.emailVerificationToken,
            emailVerificationTokenExpiresAt:
                doc.emailVerificationTokenExpiresAt,
            emailVerifiedAt: doc.emailVerifiedAt,
            availableActions: getAvailableActions(doc.status),
        };
    }

    async findAll(status?: AnamneseStatus): Promise<Anamnese[]> {
        const filter = status ? { status } : {};
        const docs = await this.anamneseModel.find(filter).exec();
        return docs.map((doc) => this.mapAnamneseDoc(doc));
    }

    async findOne(anamneseId: string): Promise<Anamnese> {
        const doc = await this.anamneseModel.findById(anamneseId).exec();
        if (!doc) throw new NotFoundException(this.NOT_FOUND_TEXT + anamneseId);
        return this.mapAnamneseDoc(doc);
    }

    async create(input: CreateAnamneseInput): Promise<SubmissionResult> {
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + DAY);
        const doc = await this.anamneseModel.create({
            ...input,
            status: AnamneseStatus.PENDING_VERIFICATION,
            emailVerificationToken: token,
            emailVerificationTokenExpiresAt: expiresAt,
        });
        await this.auditService.recordCreate(doc._id);
        return {
            success: true,
            verificationLinkForDemo: this.VERIFICATION_LINK_BASE + token,
        };
    }

    async verifyEmail(token: string): Promise<VerificationResult> {
        const doc = await this.anamneseModel.findOne({
            emailVerificationToken: token,
        });

        if (!doc) return { success: false, error: 'Kein gültiges Token!' };
        if (
            !doc.emailVerificationTokenExpiresAt ||
            doc.emailVerificationTokenExpiresAt < new Date()
        )
            return { success: false, error: 'Das Token ist abgelaufen!' };
        if (doc.status !== AnamneseStatus.PENDING_VERIFICATION)
            return {
                success: false,
                error: 'Deine E-Mail wurde bereits bestätigt.',
            };
        doc.status = this.statusService.transition(
            doc.status,
            AnamneseAction.VERIFY,
        );
        doc.emailVerifiedAt = new Date();
        await doc.save();
        await this.auditService.recordEMailVerified(doc._id);
        return {
            success: true,
        };
    }

    async transition(
        anamneseId: string,
        action: AnamneseAction,
        userId: string,
    ): Promise<Anamnese> {
        const doc = await this.anamneseModel.findById(anamneseId).exec();
        if (!doc) throw new NotFoundException(this.NOT_FOUND_TEXT + anamneseId);

        const currentStatus = doc.status;
        const newStatus = this.statusService.transition(currentStatus, action);
        doc.status = newStatus;
        await doc.save();

        await this.auditService.recordStatusTransition(doc._id, userId);

        return this.mapAnamneseDoc(doc);
    }
}
