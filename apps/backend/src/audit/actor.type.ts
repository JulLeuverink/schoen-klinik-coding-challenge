import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuditActor {
    @Field()
    type!: string;
    @Field({ nullable: true })
    userId?: string;
    @Field({ nullable: true })
    role?: string;
}
