import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NuiOverlaysService } from './overlays.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, OverlayModule, DialogModule, PortalModule],
  providers: [NuiOverlaysService],
})
export class NuiOverlaysModule {}
