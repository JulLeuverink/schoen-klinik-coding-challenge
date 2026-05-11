import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { GetAuditEntriesQuery } from '../../../../graphql/generated';

@Component({
  selector: 'app-anamnese-audit',
  imports: [DatePipe],
  templateUrl: './anamnese-audit.component.html',
  styleUrl: './anamnese-audit.component.css',
})
export class AnamneseAuditComponent {
  auditEntries = input.required<GetAuditEntriesQuery['getAuditEntries']>();
}
