import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAnamneseGQL, CreateAnamneseInput } from '../../../graphql/generated';

@Component({
  selector: 'app-anamnese-form.component',
  imports: [ReactiveFormsModule],
  templateUrl: './anamnese-form.component.html',
  styleUrl: './anamnese-form.component.css',
})
export class AnamneseFormComponent {
  private formBuilder = inject(FormBuilder);
  private createAnamneseService = inject(CreateAnamneseGQL);

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
          } as CreateAnamneseInput,
        },
      })
      .subscribe({
        next: (result) => console.log(result.data),
        error: (err) => console.error(err),
      });
  }
}
