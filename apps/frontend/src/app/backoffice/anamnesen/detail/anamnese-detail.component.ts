import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Anamnese,
  AnamneseAction,
  GetAnamneseGQL,
  TransitionAnamneseStatusGQL,
} from '../../../graphql/generated';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { getFullName } from '../../../shared/utils/stringUtils';
import { AnamneseActions } from './anamnese-actions/anamnese-actions';
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
  ],
  templateUrl: './anamnese-detail.component.html',
  styleUrl: './anamnese-detail.component.css',
})
export class AnamneseDetailComponent implements OnInit {
  private anamneseService = inject(GetAnamneseGQL);
  private transitionService = inject(TransitionAnamneseStatusGQL);
  private route = inject(ActivatedRoute);

  anamnese = signal<Anamnese | null>(null);

  private fetchAnamnese(id: string): void {
    this.anamneseService.fetch({ variables: { id }, fetchPolicy: 'network-only' }).subscribe({
      next: (result) => this.anamnese.set(result.data?.getOneAnamnese ?? null),
      error: () => {
        //TODO: Umleitung zur Error Page
        console.error('Ein Fehler ist aufgetreten.');
      },
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] as string;
    this.fetchAnamnese(id);
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
      },
    });
  }
}
