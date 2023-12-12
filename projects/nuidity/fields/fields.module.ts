import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NuiFieldComponent } from './field/field.component';
import { NuiInputDirective } from './input/input.directive';
import { NuiLabelDirective } from './label/label.directive';

@NgModule({
  declarations: [NuiFieldComponent, NuiInputDirective, NuiLabelDirective],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [NuiFieldComponent, NuiInputDirective, NuiLabelDirective],
})
export class NuiFieldsModule {}
