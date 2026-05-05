import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditEntryDocument, AuditEntrySchema } from './audit.document';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditEntryDocument.name, schema: AuditEntrySchema },
    ]),
  ],
})
export class AuditModule {}
