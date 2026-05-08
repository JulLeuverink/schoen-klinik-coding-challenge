import { Component, input } from '@angular/core';
import { PreExistingConditions } from '../../../../graphql/generated';

@Component({
  selector: 'app-anamnese-conditions',
  imports: [],
  templateUrl: './anamnese-conditions.component.html',
  styleUrl: './anamnese-conditions.component.css',
})
export class AnamneseConditionsComponent {
  contiditons = input<PreExistingConditions>();
}
