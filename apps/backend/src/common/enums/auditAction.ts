import { registerEnumType } from '@nestjs/graphql';

export enum AuditAction {
    CREATE = 'CREATE',
    EMAIL_VERIFIED = 'EMAIL_VERIFIED',
    STATUS_TRANSITION = 'STATUS_TRANSITION',
}

registerEnumType(AuditAction, { name: 'AuditAction' });
