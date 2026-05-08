import { Component, input, output } from '@angular/core';
import { AnamneseAction } from '../../../../graphql/generated';

type PossibleActions = Exclude<AnamneseAction, AnamneseAction.Verify>;

@Component({
  selector: 'app-anamnese-actions',
  imports: [],
  templateUrl: './anamnese-actions.html',
  styleUrl: './anamnese-actions.css',
})
export class AnamneseActions {
  readonly AnamneseAction = AnamneseAction;
  actions = input.required<AnamneseAction[]>();
  transition = output<AnamneseAction>();

  map: Record<PossibleActions, { class: string; value: string }> = {
    [AnamneseAction.Review]: { class: 'btn-primary', value: 'In Prüfung nehmen' },
    [AnamneseAction.Complete]: { class: 'btn-success', value: 'Prüfung abschließen' },
    [AnamneseAction.Reject]: { class: 'btn-danger', value: 'Ablehnen' },
    [AnamneseAction.Archive]: { class: 'btn-secondary', value: 'Archivieren' },
  };

  onClick(action: AnamneseAction) {
    this.transition.emit(action);
  }

  buttonClass(action: AnamneseAction): string {
    return this.map[action as PossibleActions].class ?? 'btn-secondary';
  }

  buttonLabel(action: AnamneseAction): string {
    return this.map[action as PossibleActions].value ?? '!!!Fehlerhafter Actiontype!!!';
  }
}
