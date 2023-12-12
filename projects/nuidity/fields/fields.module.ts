import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NuiFieldComponent } from './field/field.component';
import {
  NuiPrefixDirective,
  NuiSuffixDirective,
} from './fixes/fixes.directives';
import { NuiInputDirective } from './input/input.directive';
import { NuiLabelDirective } from './label/label.directive';

const feats = [
  NuiFieldComponent,
  NuiInputDirective,
  NuiLabelDirective,
  NuiPrefixDirective,
  NuiSuffixDirective,
];

@NgModule({
  declarations: feats,
  imports: [CommonModule, ReactiveFormsModule],
  exports: feats,
})
export class NuiFieldsModule {}
