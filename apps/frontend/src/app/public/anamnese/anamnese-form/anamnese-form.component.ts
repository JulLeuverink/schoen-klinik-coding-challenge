import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAnamneseGQL, CreateAnamneseInput } from '../../../graphql/generated';
import { PreExistingConditionsValue } from './pre-existing-conditions/pre-existing-conditions-value.type';
import { PreExistingConditionsComponent } from './pre-existing-conditions/pre-existing-conditions.component';

@Component({
  selector: 'app-anamnese-form',
  imports: [ReactiveFormsModule, PreExistingConditionsComponent],
  templateUrl: './anamnese-form.component.html',
  styleUrl: './anamnese-form.component.css',
})
export class AnamneseFormComponent {
  private formBuilder = inject(FormBuilder);
  private createAnamneseService = inject(CreateAnamneseGQL);

  preExistingConditions = signal<PreExistingConditionsValue | null>(null);

  form = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    complaintsAndOnset: [''],
    workplaceAccident: [false],
    workplaceAccidentDetails: [''],
    primaryCarePhysician: [''],
    medications: [''],
    signatureConfirmed: [false, Validators.requiredTrue],
  });

  onSubmit() {
    if (this.form.invalid) return;

    const { dateOfBirth, ...values } = this.form.value;

    this.createAnamneseService
      .mutate({
        variables: {
          input: {
            ...values,
            dateOfBirth: new Date(dateOfBirth!),
            preExistingConditions: this.preExistingConditions() || undefined,
          } as CreateAnamneseInput,
        },
      })
      .subscribe({
        next: (result) => console.log(result.data),
        error: (err) => console.error(err),
      });
  }
}
