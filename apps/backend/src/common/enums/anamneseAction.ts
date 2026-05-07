import { registerEnumType } from '@nestjs/graphql';

export enum AnamneseAction {
    VERIFY,
    REVIEW,
    COMPLETE,
    REJECT,
    ARCHIVE,
}

registerEnumType(AnamneseAction, { name: 'AnamneseAction' });
