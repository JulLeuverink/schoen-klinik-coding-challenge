import { Component, input } from '@angular/core';
import { AnamneseStatus } from '../../../graphql/generated';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  status = input.required<AnamneseStatus>();

  private readonly map: Record<AnamneseStatus, string> = {
    [AnamneseStatus.PendingVerification]: 'bg-warning text-dark',
    [AnamneseStatus.Submitted]: 'bg-info text-dark',
    [AnamneseStatus.InReview]: 'bg-primary',
    [AnamneseStatus.Completed]: 'bg-success',
    [AnamneseStatus.Rejected]: 'bg-danger',
    [AnamneseStatus.Archived]: 'bg-secondary',
    [AnamneseStatus.Expired]: 'bg-dark',
  };

  get statusClass() {
    return this.map[this.status()!];
  }
}
