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
  DateTime: { input: string; output: string };
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

export enum AnamneseAction {
  Archive = 'ARCHIVE',
  Complete = 'COMPLETE',
  Reject = 'REJECT',
  Review = 'REVIEW',
  Verify = 'VERIFY',
}

export enum AnamneseStatus {
  Archived = 'ARCHIVED',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  InReview = 'IN_REVIEW',
  PendingVerification = 'PENDING_VERIFICATION',
  Rejected = 'REJECTED',
  Submitted = 'SUBMITTED',
}

export enum AuditAction {
  Create = 'CREATE',
  EmailVerified = 'EMAIL_VERIFIED',
  StatusTransition = 'STATUS_TRANSITION',
}

export type AuditActor = {
  __typename?: 'AuditActor';
  role?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type AuditEntry = {
  __typename?: 'AuditEntry';
  action: AuditAction;
  actor: AuditActor;
  entityId: Scalars['ID']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnamnese: SubmissionResult;
  transition: Anamnese;
  verifyAnamneseEmail: VerificationResult;
};

export type MutationCreateAnamneseArgs = {
  input: CreateAnamneseInput;
};

export type MutationTransitionArgs = {
  action: AnamneseAction;
  anamneseId: Scalars['String']['input'];
};

export type MutationVerifyAnamneseEmailArgs = {
  token: Scalars['String']['input'];
};

export type PreExistingConditions = {
  __typename?: 'PreExistingConditions';
  other?: Maybe<Scalars['String']['output']>;
  selected: Array<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAnamneses: Array<Anamnese>;
  getAuditEntries: Array<AuditEntry>;
  getOneAnamnese: Anamnese;
};

export type QueryGetAnamnesesArgs = {
  status?: InputMaybe<AnamneseStatus>;
};

export type QueryGetAuditEntriesArgs = {
  anamneseId: Scalars['String']['input'];
};

export type QueryGetOneAnamneseArgs = {
  anamneseId: Scalars['String']['input'];
};

export type SubmissionResult = {
  __typename?: 'SubmissionResult';
  success: Scalars['Boolean']['output'];
  verificationLinkForDemo: Scalars['String']['output'];
};

export type VerificationResult = {
  __typename?: 'VerificationResult';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CreateAnamneseInput = {
  complaintsAndOnset?: string | null | undefined;
  dateOfBirth: string;
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

export type GetAnamnesesQueryVariables = Exact<{
  status?: AnamneseStatus | null | undefined;
}>;

export type GetAnamnesesQuery = {
  getAnamneses: Array<{
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    status: AnamneseStatus;
    signatureConfirmed: boolean;
  }>;
};

export type GetAnamneseQueryVariables = Exact<{
  id: string | number;
}>;

export type GetAnamneseQuery = Record<PropertyKey, never>;

export type TransitionAnamneseStatusMutationVariables = Exact<{
  id: string | number;
  action: AnamneseAction;
}>;

export type TransitionAnamneseStatusMutation = Record<PropertyKey, never>;

export type CreateAnamneseMutationVariables = Exact<{
  input: CreateAnamneseInput;
}>;

export type CreateAnamneseMutation = {
  createAnamnese: { success: boolean; verificationLinkForDemo: string };
};

export type VerifyAnamneseEmailMutationVariables = Exact<{
  token: string;
}>;

export type VerifyAnamneseEmailMutation = {
  verifyAnamneseEmail: { success: boolean; error: string | null };
};

export const GetAnamnesesDocument = gql`
  query GetAnamneses($status: AnamneseStatus) {
    getAnamneses(status: $status) {
      id
      firstName
      lastName
      dateOfBirth
      email
      status
      signatureConfirmed
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetAnamnesesGQL extends Apollo.Query<GetAnamnesesQuery, GetAnamnesesQueryVariables> {
  document = GetAnamnesesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetAnamneseDocument = gql`
  query GetAnamnese($id: ID!) {
    getAnamnese(id: $id) {
      id
      firstName
      lastName
      dateOfBirth
      email
      status
      complaintsAndOnset
      workplaceAccident
      workplaceAccidentDetails
      primaryCarePhysician
      medications
      preExistingConditions {
        selected
        other
      }
      emailVerifiedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetAnamneseGQL extends Apollo.Query<GetAnamneseQuery, GetAnamneseQueryVariables> {
  document = GetAnamneseDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const TransitionAnamneseStatusDocument = gql`
  mutation TransitionAnamneseStatus($id: ID!, $action: AnamneseAction!) {
    transitionAnamneseStatus(id: $id, action: $action) {
      id
      status
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TransitionAnamneseStatusGQL extends Apollo.Mutation<
  TransitionAnamneseStatusMutation,
  TransitionAnamneseStatusMutationVariables
> {
  document = TransitionAnamneseStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
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
export const VerifyAnamneseEmailDocument = gql`
  mutation VerifyAnamneseEmail($token: String!) {
    verifyAnamneseEmail(token: $token) {
      success
      error
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VerifyAnamneseEmailGQL extends Apollo.Mutation<
  VerifyAnamneseEmailMutation,
  VerifyAnamneseEmailMutationVariables
> {
  document = VerifyAnamneseEmailDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
