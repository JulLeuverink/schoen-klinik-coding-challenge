import { AnamneseStatus } from '../../../graphql/generated';

export const StatusMap: Record<AnamneseStatus, { class: string; value: string }> = {
  [AnamneseStatus.PendingVerification]: {
    class: 'bg-warning text-dark',
    value: 'Verifizierung ausstehend',
  },
  [AnamneseStatus.Submitted]: { class: 'bg-info text-dark', value: 'Übermittelt' },
  [AnamneseStatus.InReview]: { class: 'bg-primary', value: 'Wird geprüft' },
  [AnamneseStatus.Completed]: { class: 'bg-success', value: 'Überprüfung abgeschlossen' },
  [AnamneseStatus.Rejected]: { class: 'bg-danger', value: 'Abgelehnt' },
  [AnamneseStatus.Archived]: { class: 'bg-secondary', value: 'Archiviert' },
  [AnamneseStatus.Expired]: { class: 'bg-dark', value: 'Abgelaufen' },
};
