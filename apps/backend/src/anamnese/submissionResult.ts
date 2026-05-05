import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubmissionResult {
    @Field()
    success!: boolean;

    @Field()
    verificationLinkForDemo!: string;
}
