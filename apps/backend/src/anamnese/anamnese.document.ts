import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';

export type AnamneseDocumentType = HydratedDocument<AnamneseDocument>;

@Schema({ timestamps: true })
export class AnamneseDocument {
  @Prop({ required: true, enum: AnamneseStatus })
  status!: AnamneseStatus;

  @Prop({ required: true }) firstName!: string;
  @Prop({ required: true }) lastName!: string;
  @Prop({ required: true }) dateOfBirth!: Date;
  @Prop({ required: true }) email!: string;

  @Prop() complaintsAndOnset?: string;
  @Prop() workplaceAccident?: boolean;
  @Prop() workplaceAccidentDetails?: string;
  @Prop({ type: Object }) preExistingConditions?: {
    selected: string[];
    other?: string;
  };
  @Prop() primaryCarePhysician?: string;
  @Prop() medications?: string;

  @Prop() emailVerificationToken?: string;
  @Prop() emailVerificationTokenExpiresAt?: Date;
  @Prop() emailVerifiedAt?: Date;

  @Prop({ required: true, default: false }) signatureConfirmed!: boolean;
}

export const AnamneseSchema = SchemaFactory.createForClass(AnamneseDocument);
