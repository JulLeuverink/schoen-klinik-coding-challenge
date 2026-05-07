import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditAction } from 'src/common/enums/auditAction';
import { AuditEntry } from './aduitentry';
import { AuditEntryDocument, AuditEntryDocumentType } from './audit.document';

@Injectable()
export class AuditService {
    constructor(
        @InjectModel(AuditEntryDocument.name)
        private auditModel: Model<AuditEntryDocumentType>,
    ) {}

    async findByEntityId(anamneseId: Types.ObjectId): Promise<AuditEntry[]> {
        const docs = await this.auditModel
            .find({ entityId: anamneseId })
            .exec();
        return docs.map((doc) => {
            return {
                id: doc._id.toString(),
                timestamp: doc.timestamp,
                entityType: doc.entityType,
                entityId: doc.entityId,
                action: doc.action,
                actor: doc.actor,
            };
        });
    }

    async recordCreate(entityId: Types.ObjectId): Promise<void> {
        await this.auditModel.create({
            timestamp: new Date(),
            entityType: 'Anamnese',
            entityId,
            action: AuditAction.CREATE,
            actor: { type: 'patient' },
        });
    }

    async recordEMailVerified(entityId: Types.ObjectId): Promise<void> {
        await this.auditModel.create({
            timestamp: new Date(),
            entityType: 'Anamnese',
            entityId,
            action: AuditAction.STATUS_TRANSITION,
            actor: { type: 'patient' },
        });
    }

    async recordStatusTransition(
        entityId: Types.ObjectId,
        userId: string,
    ): Promise<void> {
        await this.auditModel.create({
            timestamp: new Date(),
            entityType: 'Anamnese',
            entityId,
            action: AuditAction.STATUS_TRANSITION,
            actor: { type: 'staff', userId },
        });
    }
}
