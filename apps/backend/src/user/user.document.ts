import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/common/enums/userRole';

export type UserDocumentType = HydratedDocument<UserDocument>;

@Schema({ timestamps: true })
export class UserDocument {
  @Prop({ required: true, unique: true })
  email!: string;
  @Prop({ required: true })
  passwordHash!: string;
  @Prop({ required: true, enum: UserRole, default: UserRole.STAFF })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
