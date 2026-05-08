import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnamneseStatus, GetAnamnesesGQL, GetAnamnesesQuery } from '../../graphql/generated';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { StatusMap } from '../../shared/components/status-badge/statusMap';
import { getFullName } from '../../shared/utils/stringUtils';

@Component({
  selector: 'app-anamnesen-list',
  imports: [RouterLink, DatePipe, StatusBadge],
  templateUrl: './anamnesen-list.component.html',
  styleUrl: './anamnesen-list.component.css',
})
export class AnamnesenListComponent {
  readonly statusOptions = Object.values(AnamneseStatus);
  readonly statusMap = StatusMap;

  anamnesesService = inject(GetAnamnesesGQL);
  statusFilter = signal<AnamneseStatus | null>(null);

  // type Anamnese hat availableActions, das brauchen wir in der Liste aber nicht
  // deshalb GetAnamnesesQuery['getAnamneses'] hier als type
  anamneses = signal<GetAnamnesesQuery['getAnamneses'] | null>(null);

  fullName(firstName: string, lastName: string): string {
    return getFullName(firstName, lastName);
  }

  constructor() {
    effect(() => {
      this.anamnesesService
        .fetch({ variables: { status: this.statusFilter() ?? undefined } })
        .subscribe({
          next: (result) => this.anamneses.set(result.data?.getAnamneses ?? []),
          error: () => console.error('Es ist ein Fehler aufgetreten!'), //TODO: Auf Errorpage umleiten.
        });
    });
  }
}
