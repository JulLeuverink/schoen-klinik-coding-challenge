import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Anamnese } from './anamnese';
import { AnamneseService } from './anamnese.service';
import { CreateAnamneseInput } from './create-anamnese.input';
import { SubmissionResult } from './submissionResult';
import { VerificationResult } from './verify-anamnese/verification-result';

@Resolver()
export class AnamneseResolver {
    constructor(private anamneseService: AnamneseService) {}

    @Query(() => [Anamnese])
    async getAnamneses(): Promise<Anamnese[]> {
        return this.anamneseService.findAll();
    }

    @Mutation(() => SubmissionResult)
    async createAnamnese(
        @Args('input') input: CreateAnamneseInput,
    ): Promise<SubmissionResult> {
        return this.anamneseService.create(input);
    }

    @Mutation(() => VerificationResult)
    async verifyAnamneseEmail(
        @Args('token') token: string,
    ): Promise<VerificationResult> {
        return this.anamneseService.verifyEmail(token);
    }
}
