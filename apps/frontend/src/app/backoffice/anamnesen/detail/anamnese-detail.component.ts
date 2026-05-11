import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Anamnese,
  AnamneseAction,
  GetAnamneseGQL,
  GetAuditEntriesGQL,
  GetAuditEntriesQuery,
  TransitionAnamneseStatusGQL,
} from '../../../graphql/generated';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { getFullName } from '../../../shared/utils/stringUtils';
import { AnamneseActions } from './anamnese-actions/anamnese-actions';
import { AnamneseAuditComponent } from './anamnese-audit.component/anamnese-audit.component';
import { AnamneseConditionsComponent } from './anamnese-conditions/anamnese-conditions.component';

@Component({
  selector: 'app-anamnese-detail',
  imports: [
    RouterLink,
    DatePipe,
    CardComponent,
    AnamneseConditionsComponent,
    StatusBadge,
    AnamneseActions,
    AnamneseAuditComponent,
  ],
  templateUrl: './anamnese-detail.component.html',
  styleUrl: './anamnese-detail.component.css',
})
export class AnamneseDetailComponent implements OnInit {
  private anamneseService = inject(GetAnamneseGQL);
  private auditService = inject(GetAuditEntriesGQL);
  private transitionService = inject(TransitionAnamneseStatusGQL);
  private route = inject(ActivatedRoute);

  anamnese = signal<Anamnese | null>(null);
  // AuditEntries hat noch zwei Felder, die wir an dieser Stelle nicht brauchen. Deshalb GetAuditEntriesQuery['getAuditEntries].
  auditEntries = signal<GetAuditEntriesQuery['getAuditEntries']>([]);

  private fetchAnamnese(id: string): void {
    this.anamneseService.fetch({ variables: { id }, fetchPolicy: 'network-only' }).subscribe({
      next: (result) => this.anamnese.set(result.data?.getOneAnamnese ?? null),
      error: () => {
        //TODO: Umleitung zur Error Page
        console.error('Es ist ein Fehler beim holen der Anamnesedaten aufgetreten. ');
      },
    });
  }

  private fetchAuditEntries(id: string): void {
    this.auditService
      .fetch({ variables: { anamneseId: id }, fetchPolicy: 'network-only' })
      .subscribe({
        next: (result) => this.auditEntries.set(result.data?.getAuditEntries ?? []),
        error: () => {
          //TODO: Umleitung zu Error Page
          console.error('Es ist ein Fehler beim holen der AuditEntries aufgetreten.');
        },
      });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] as string;
    this.fetchAnamnese(id);
    this.fetchAuditEntries(id);
  }

  get fullName(): string {
    return getFullName(this.anamnese()?.firstName, this.anamnese()?.lastName);
  }

  transition(action: AnamneseAction): void {
    const id = this.anamnese()?.id;
    if (!id) return;
    this.transitionService.mutate({ variables: { anamneseId: id, action } }).subscribe({
      next: () => {
        this.fetchAnamnese(id);
        this.fetchAuditEntries(id);
      },
    });
  }
}
