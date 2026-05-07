import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerificationResult {
    @Field()
    success!: boolean;

    @Field({ nullable: true })
    error?: string;
}
