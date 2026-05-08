import { AnamneseAction } from 'src/common/enums/anamneseAction';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';

export type Transition = {
    from: AnamneseStatus;
    action: AnamneseAction;
    to: AnamneseStatus;
};

export const TRANSITIONS: Transition[] = [
    {
        from: AnamneseStatus.PENDING_VERIFICATION,
        action: AnamneseAction.VERIFY,
        to: AnamneseStatus.SUBMITTED,
    },
    {
        from: AnamneseStatus.SUBMITTED,
        action: AnamneseAction.REVIEW,
        to: AnamneseStatus.IN_REVIEW,
    },
    {
        from: AnamneseStatus.IN_REVIEW,
        action: AnamneseAction.COMPLETE,
        to: AnamneseStatus.COMPLETED,
    },
    {
        from: AnamneseStatus.IN_REVIEW,
        action: AnamneseAction.REJECT,
        to: AnamneseStatus.REJECTED,
    },
    {
        from: AnamneseStatus.COMPLETED,
        action: AnamneseAction.ARCHIVE,
        to: AnamneseStatus.ARCHIVED,
    },
    {
        from: AnamneseStatus.REJECTED,
        action: AnamneseAction.ARCHIVE,
        to: AnamneseStatus.ARCHIVED,
    },
];

export const getAvailableActions = (
    status: AnamneseStatus,
): AnamneseAction[] => {
    return TRANSITIONS.filter((trans) => trans.from === status).map(
        (trans) => trans.action,
    );
};

// Beispiel für State Machine auf Basis von State Pattern.

// abstract class AnamneseState {
//     abstract transition(action: AnamneseAction): AnamneseStatus;
// }

// class AnamneseInReviewState extends AnamneseState{
//     transition(action: AnamneseAction): AnamneseStatus {
//         if (action === AnamneseAction.COMPLETE) return AnamneseStatus.COMPLETED
//         if (action === AnamneseAction.REJECT) return AnamneseStatus.REJECTED
//         throw new BadRequestException(`Aktion ${action} ist nicht erlaubt.`)
//     }
// }
