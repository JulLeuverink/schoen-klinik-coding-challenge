import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';
import { Anamnese } from './anamnese';
import { AnamneseDocument, AnamneseDocumentType } from './anamnese.document';
import { CreateAnamneseInput } from './create-anamnese.input';
import { SubmissionResult } from './submissionResult';

@Injectable()
export class AnamneseService {
    constructor(
        @InjectModel(AnamneseDocument.name)
        private anamneseModel: Model<AnamneseDocumentType>,
    ) {}

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
        };
    }

    async findAll(): Promise<Anamnese[]> {
        const docs = await this.anamneseModel.find().exec();
        return docs.map((doc) => this.mapAnamneseDoc(doc));
    }

    async create(input: CreateAnamneseInput): Promise<SubmissionResult> {
        const doc = await this.anamneseModel.create({
            ...input,
            status: AnamneseStatus.PENDING_VERIFICATION,
        });
        return {
            success: true,
            verificationLinkForDemo: 'hier-den-Link-generieren',
        };
    }
}
