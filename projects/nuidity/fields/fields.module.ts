import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NuiFieldComponent } from './field/field.component';
import {
  NuiPrefixDirective,
  NuiSuffixDirective,
} from './fixes/fixes.directives';
import { NuiHintDirective } from './hint/hint.directive';
import { NuiInputDirective } from './input/input.directive';
import { NuiLabelDirective } from './label/label.directive';
import { NuiTypeSwitchDirective } from './type-switch/type-switch.directive';

const feats = [
  NuiFieldComponent,
  NuiInputDirective,
  NuiLabelDirective,
  NuiPrefixDirective,
  NuiSuffixDirective,
  NuiTypeSwitchDirective,
  NuiHintDirective,
];

@NgModule({
  declarations: feats,
  imports: [CommonModule, ReactiveFormsModule],
  exports: feats,
})
export class NuiFieldsModule {}
