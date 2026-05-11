import { registerEnumType } from '@nestjs/graphql';

export enum AnamneseStatus {
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
    SUBMITTED = 'SUBMITTED',
    IN_REVIEW = 'IN_REVIEW',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    ARCHIVED = 'ARCHIVED',
}

registerEnumType(AnamneseStatus, { name: 'AnamneseStatus' });
