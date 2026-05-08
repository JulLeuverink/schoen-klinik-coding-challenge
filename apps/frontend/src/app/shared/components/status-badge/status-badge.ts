import { Component, input } from '@angular/core';
import { AnamneseStatus } from '../../../graphql/generated';
import { StatusMap } from './statusMap';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  status = input.required<AnamneseStatus>();
  map = StatusMap;

  get statusClass(): string {
    return this.map[this.status()!].class;
  }

  get statusValue() {
    return this.map[this.status()!].value;
  }
}
