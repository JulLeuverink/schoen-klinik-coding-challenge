import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AuditAction } from 'src/common/enums/auditAction';
import { AuditActor } from './actor.type';

@ObjectType()
export class AuditEntry {
    @Field(() => ID)
    id!: string;

    @Field(() => Date)
    timestamp!: Date;

    @Field()
    entityType!: string;

    @Field(() => ID)
    entityId!: string;

    @Field(() => AuditAction)
    action!: AuditAction;

    @Field(() => AuditActor)
    actor!: AuditActor;
}
