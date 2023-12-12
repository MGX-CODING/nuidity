import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestableFeature } from '../../utils/testing/testable-feature.spec';
import { NuiFieldsModule } from '../fields.module';
import { NuiInputDirective } from './input.directive';

@Component({
  template: '<input type="text" nui-input [formControl]="control">',
  standalone: true,
  imports: [NuiFieldsModule, ReactiveFormsModule],
})
class TestComponent {
  control = new FormControl('');
}

const helper = new TestableFeature(
  TestComponent,
  NuiInputDirective,
  '[nui-input]'
);

describe('Field input directive', () => {
  helper.prepareTestBed();

  helper.isCreated();
  helper.hasClass('nui-field-input');
  helper.canHandleAttribute('id');
  helper.canHandleAttribute('type');
});
