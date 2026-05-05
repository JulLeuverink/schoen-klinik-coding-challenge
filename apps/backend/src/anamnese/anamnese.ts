import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';

@ObjectType()
class PreExistingConditions {
    @Field(() => [String])
    selected!: string[];

    @Field({ nullable: true })
    other?: string;
}

@ObjectType()
export class Anamnese {
    @Field(() => ID)
    id!: string;

    @Field(() => AnamneseStatus)
    status!: AnamneseStatus;

    @Field()
    firstName!: string;
    @Field()
    lastName!: string;
    @Field(() => Date)
    dateOfBirth!: Date;
    @Field()
    email!: string;

    @Field({ nullable: true })
    complaintsAndOnset?: string;
    @Field({ nullable: true })
    workplaceAccident?: boolean;
    @Field({ nullable: true })
    workplaceAccidentDetails?: string;
    @Field(() => PreExistingConditions, { nullable: true })
    preExistingConditions?: PreExistingConditions;
    @Field({ nullable: true })
    primaryCarePhysician?: string;
    @Field({ nullable: true })
    medications?: string;

    // Diese Felder werden nur in der Demo im GraphQL Schema exponiert, da wir das Token irgendwie anzeigen müssen.
    // Es existiert kein echter E-Mail verification Flow.
    // TODO: remove in production!
    @Field({ nullable: true })
    emailVerificationToken?: string;
    @Field({ nullable: true })
    emailVerificationTokenExpiresAt?: Date;
    @Field({ nullable: true })
    emailVerifiedAt?: Date;

    @Field()
    signatureConfirmed!: boolean;
}
