/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: unknown; output: unknown };
};

export type Anamnese = {
  __typename?: 'Anamnese';
  complaintsAndOnset?: Maybe<Scalars['String']['output']>;
  dateOfBirth: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerificationToken?: Maybe<Scalars['String']['output']>;
  emailVerificationTokenExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  medications?: Maybe<Scalars['String']['output']>;
  preExistingConditions?: Maybe<PreExistingConditions>;
  primaryCarePhysician?: Maybe<Scalars['String']['output']>;
  signatureConfirmed: Scalars['Boolean']['output'];
  status: AnamneseStatus;
  workplaceAccident?: Maybe<Scalars['Boolean']['output']>;
  workplaceAccidentDetails?: Maybe<Scalars['String']['output']>;
};

export enum AnamneseStatus {
  Archived = 'ARCHIVED',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  InReview = 'IN_REVIEW',
  PendingVerification = 'PENDING_VERIFICATION',
  Rejected = 'REJECTED',
  Submitted = 'SUBMITTED',
}

export type Mutation = {
  __typename?: 'Mutation';
  createAnamnese: SubmissionResult;
};

export type MutationCreateAnamneseArgs = {
  input: CreateAnamneseInput;
};

export type PreExistingConditions = {
  __typename?: 'PreExistingConditions';
  other?: Maybe<Scalars['String']['output']>;
  selected: Array<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAnamneses: Array<Anamnese>;
};

export type SubmissionResult = {
  __typename?: 'SubmissionResult';
  success: Scalars['Boolean']['output'];
  verificationLinkForDemo: Scalars['String']['output'];
};

export type CreateAnamneseInput = {
  complaintsAndOnset?: string | null | undefined;
  dateOfBirth: unknown;
  email: string;
  firstName: string;
  lastName: string;
  medications?: string | null | undefined;
  preExistingConditions?: PreExistingConditionsInput | null | undefined;
  primaryCarePhysician?: string | null | undefined;
  signatureConfirmed: boolean;
  workplaceAccident?: boolean;
  workplaceAccidentDetails?: string | null | undefined;
};

export type PreExistingConditionsInput = {
  other?: string | null | undefined;
  selected: Array<string>;
};

export type CreateAnamneseMutationVariables = Exact<{
  input: CreateAnamneseInput;
}>;

export type CreateAnamneseMutation = {
  createAnamnese: { success: boolean; verificationLinkForDemo: string };
};

export const CreateAnamneseDocument = gql`
  mutation CreateAnamnese($input: CreateAnamneseInput!) {
    createAnamnese(input: $input) {
      success
      verificationLinkForDemo
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateAnamneseGQL extends Apollo.Mutation<
  CreateAnamneseMutation,
  CreateAnamneseMutationVariables
> {
  document = CreateAnamneseDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
