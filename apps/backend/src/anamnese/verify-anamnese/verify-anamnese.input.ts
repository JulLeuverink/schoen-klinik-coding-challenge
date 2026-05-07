import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class VerifyAnamneseInput {
    @IsString()
    @IsNotEmpty()
    @Field()
    token!: string;
}
