import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Anamnese, AnamneseStatus, GetAnamnesesGQL } from '../../graphql/generated';

@Component({
  selector: 'app-anamnesen-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './anamnesen-list.component.html',
  styleUrl: './anamnesen-list.component.css',
})
export class AnamnesenListComponent {
  readonly statusOptions = Object.values(AnamneseStatus);

  anamnesesService = inject(GetAnamnesesGQL);
  statusFilter = signal<AnamneseStatus | null>(null);

  anamneses = signal<Anamnese[] | null>(null);

  constructor() {
    effect(() => {
      this.anamnesesService
        .fetch({ variables: { status: this.statusFilter() ?? undefined } })
        .subscribe({
          next: (result) => this.anamneses.set(result.data?.getAnamneses ?? []),
        });
    });
  }

  statusBadgeClass(status: AnamneseStatus): string {
    const map: Record<AnamneseStatus, string> = {
      [AnamneseStatus.PendingVerification]: 'bg-warning text-dark',
      [AnamneseStatus.Submitted]: 'bg-info text-dark',
      [AnamneseStatus.InReview]: 'bg-primary',
      [AnamneseStatus.Completed]: 'bg-success',
      [AnamneseStatus.Rejected]: 'bg-danger',
      [AnamneseStatus.Archived]: 'bg-secondary',
      [AnamneseStatus.Expired]: 'bg-dark',
    };
    return map[status] ?? 'bg-secondary';
  }
}
