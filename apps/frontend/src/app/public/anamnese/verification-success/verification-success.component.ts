import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyAnamneseEmailGQL } from '../../../graphql/generated';

@Component({
  selector: 'app-verification-success',
  imports: [],
  templateUrl: './verification-success.component.html',
  styleUrl: './verification-success.component.css',
})
export class VerificationSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private verifyEmailService = inject(VerifyAnamneseEmailGQL);

  success = signal<boolean | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.params['token'] as string;
    this.verifyEmailService.mutate({ variables: { token } }).subscribe({
      next: (result) => {
        this.success.set(result.data?.verifyAnamneseEmail.success ?? false);
        this.error.set(result.data?.verifyAnamneseEmail.error ?? null);
      },
      error: () => this.error.set('Es ist ein Fehler aufgetreten!'),
    });
  }
}
