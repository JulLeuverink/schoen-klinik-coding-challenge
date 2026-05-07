import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from 'src/audit/audit.module';
import { AnamneseDocument, AnamneseSchema } from './anamnese.document';
import { AnamneseResolver } from './anamnese.resolver';
import { AnamneseService } from './anamnese.service';
import { StatusService } from './status/status.service';
import { BackofficeResolver } from './backoffice/backoffice.resolver';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AnamneseDocument.name, schema: AnamneseSchema },
        ]),
        AuditModule,
    ],
    providers: [AnamneseResolver, AnamneseService, StatusService, BackofficeResolver],
})
export class AnamneseModule {}
