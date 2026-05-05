import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { AuditAction } from 'src/common/enums/auditAction';

export type AuditEntryDocumentType = HydratedDocument<AuditEntryDocument>;

@Schema({ timestamps: true })
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
  actor!: { type: string; userId?: string; role?: string };

  @Prop({ type: Object })
  payload?: Record<string, unknown>;

  @Prop()
  ipAddress?: string;
}

export const AuditEntrySchema =
  SchemaFactory.createForClass(AuditEntryDocument);
