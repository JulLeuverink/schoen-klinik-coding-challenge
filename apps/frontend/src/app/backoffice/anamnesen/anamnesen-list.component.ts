import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnamneseStatus, GetAnamnesesGQL, GetAnamnesesQuery } from '../../graphql/generated';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-anamnesen-list',
  imports: [RouterLink, DatePipe, StatusBadge],
  templateUrl: './anamnesen-list.component.html',
  styleUrl: './anamnesen-list.component.css',
})
export class AnamnesenListComponent {
  readonly statusOptions = Object.values(AnamneseStatus);

  anamnesesService = inject(GetAnamnesesGQL);
  statusFilter = signal<AnamneseStatus | null>(null);

  // type Anamnese hat availableActions, das brauchen in der Liste aber nicht
  // deshalb GetAnamnesesQuery['getAnamneses'] hier als type
  anamneses = signal<GetAnamnesesQuery['getAnamneses'] | null>(null);

  constructor() {
    effect(() => {
      this.anamnesesService
        .fetch({ variables: { status: this.statusFilter() ?? undefined } })
        .subscribe({
          next: (result) => this.anamneses.set(result.data?.getAnamneses ?? []),
        });
    });
  }
}
