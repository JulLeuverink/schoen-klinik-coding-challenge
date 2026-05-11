import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-backoffice-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './backoffice-layout.component.html',
  styleUrl: './backoffice-layout.component.css',
})
export class BackofficeLayoutComponent {}
