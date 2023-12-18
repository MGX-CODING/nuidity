import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NuiDatepickerComponent } from './datepicker.component';
import { NuiButtonsModule } from '@mgxdev/nuidity/buttons';

const feats = [NuiDatepickerComponent];

@NgModule({
  declarations: feats,
  exports: feats,
  imports: [CommonModule, NuiButtonsModule],
})
export class NuiDatepickerModule {}
