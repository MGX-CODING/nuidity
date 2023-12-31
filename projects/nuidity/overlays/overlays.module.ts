import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NuiOverlaysService } from './overlays.service';
import { DialogCloseDirective } from './dialogs/dialog-close.directive';

@NgModule({
  declarations: [
    DialogCloseDirective
  ],
  imports: [CommonModule, OverlayModule, DialogModule, PortalModule],
  providers: [NuiOverlaysService],
  exports: [
    DialogCloseDirective
  ],
})
export class NuiOverlaysModule {}
