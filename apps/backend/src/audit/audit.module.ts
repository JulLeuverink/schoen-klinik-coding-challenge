import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditEntryDocument, AuditEntrySchema } from './audit.document';
import { AuditService } from './audit.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AuditEntryDocument.name, schema: AuditEntrySchema },
        ]),
    ],
    exports: [AuditService],
    providers: [AuditService],
})
export class AuditModule {}
