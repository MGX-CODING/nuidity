import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  NuiOverlaysModule,
  NuiOverlaysService,
} from '@mgxdev/nuidity/overlays';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NuiOverlaysModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private service = inject(NuiOverlaysService);
  private router = inject(Router);

  @ViewChild('dialog') dialog?: TemplateRef<any>;

  ngAfterViewInit() {
    const ref = this.service.dialog(this.dialog!, { closeOnNavigation: false });
  }
}
