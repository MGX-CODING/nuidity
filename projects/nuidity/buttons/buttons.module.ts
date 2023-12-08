import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NuiButtonDirective } from './button.directive';

@NgModule({
  declarations: [NuiButtonDirective],
  imports: [CommonModule],
  exports: [NuiButtonDirective],
})
export class NuiButtonsModule {}
