import { registerEnumType } from '@nestjs/graphql';

export enum AnamneseStatus {
    PENDING_VERIFICATION,
    SUBMITTED,
    IN_REVIEW,
    COMPLETED,
    REJECTED,
    EXPIRED,
    ARCHIVED,
}

registerEnumType(AnamneseStatus, { name: 'AnamneseStatus' });
