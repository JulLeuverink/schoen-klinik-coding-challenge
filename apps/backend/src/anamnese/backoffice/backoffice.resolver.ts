import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { AuditEntry } from 'src/audit/aduitentry';
import { AuditService } from 'src/audit/audit.service';
import { AnamneseAction } from 'src/common/enums/anamneseAction';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';
import { Anamnese } from '../anamnese';
import { AnamneseService } from '../anamnese.service';

@Resolver()
export class BackofficeResolver {
    constructor(
        private anamneseService: AnamneseService,
        private auditService: AuditService,
    ) {}

    @Query(() => [Anamnese])
    async getAnamneses(
        @Args('status', { type: () => AnamneseStatus, nullable: true })
        status?: AnamneseStatus,
    ): Promise<Anamnese[]> {
        return this.anamneseService.findAll(status);
    }

    @Query(() => Anamnese)
    async getOneAnamnese(
        @Args('anamneseId') anamneseId: string,
    ): Promise<Anamnese> {
        return this.anamneseService.findOne(anamneseId);
    }

    @Mutation(() => Anamnese)
    async transition(
        @Args('anamneseId') anamneseId: string,
        @Args('action', { type: () => AnamneseAction }) action: AnamneseAction,
    ): Promise<Anamnese> {
        return this.anamneseService.transition(
            anamneseId,
            action,
            'mitarbeiter-user-id',
        );
    }

    @Query(() => [AuditEntry])
    async getAuditEntries(
        @Args('anamneseId') anamneseId: string,
    ): Promise<AuditEntry[]> {
        return this.auditService.findByEntityId(new Types.ObjectId(anamneseId));
    }
}
