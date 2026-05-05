import { Field, InputType } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

@InputType()
class PreExistingConditionsInput {
    @IsArray()
    @IsString({ each: true })
    @Field(() => [String])
    selected!: string[];

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    other?: string;
}

@InputType()
export class CreateAnamneseInput {
    @IsString()
    @IsNotEmpty()
    @Field()
    firstName!: string;
    @IsString()
    @IsNotEmpty()
    @Field()
    lastName!: string;
    @Transform(({ value }) => new Date(value as string))
    @IsDate()
    @Field(() => Date)
    dateOfBirth!: Date;
    @IsEmail()
    @IsNotEmpty()
    @Field()
    email!: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    complaintsAndOnset?: string;
    @IsBoolean()
    @IsOptional()
    @Field({ defaultValue: false })
    workplaceAccident?: boolean;
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    workplaceAccidentDetails?: string;

    @ValidateNested()
    @Type(() => PreExistingConditionsInput)
    @IsOptional()
    @Field(() => PreExistingConditionsInput, { nullable: true })
    preExistingConditions?: PreExistingConditionsInput;
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    primaryCarePhysician?: string;
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    medications?: string;

    @IsBoolean()
    @Field()
    signatureConfirmed!: boolean;
}
