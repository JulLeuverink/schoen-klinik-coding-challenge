import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { AuditAction } from 'src/common/enums/auditAction';
import { type AuditActor } from './actor.type';

export type AuditEntryDocumentType = HydratedDocument<AuditEntryDocument>;

@Schema()
export class AuditEntryDocument {
    @Prop({ required: true })
    timestamp!: Date;

    @Prop({ required: true })
    entityType!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    entityId!: Types.ObjectId;

    @Prop({ required: true, enum: AuditAction })
    action!: AuditAction;

    @Prop({ type: Object, required: true })
    actor!: AuditActor;
}

export const AuditEntrySchema =
    SchemaFactory.createForClass(AuditEntryDocument);
