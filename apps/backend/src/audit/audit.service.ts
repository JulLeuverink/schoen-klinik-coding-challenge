import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditAction } from 'src/common/enums/auditAction';
import { AuditEntryDocument, AuditEntryDocumentType } from './audit.document';

@Injectable()
export class AuditService {
    constructor(
        @InjectModel(AuditEntryDocument.name)
        private auditModel: Model<AuditEntryDocumentType>,
    ) {}

    async recordCreate(
        entityId: Types.ObjectId,
        payload?: Record<string, unknown>,
    ): Promise<void> {
        await this.auditModel.create({
            timestamp: new Date(),
            entityType: 'Anamnese',
            entityId,
            action: AuditAction.CREATE,
            actor: { type: 'patient' },
            payload,
        });
    }
}
