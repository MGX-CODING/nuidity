import { Component } from '@angular/core';
import { TestableFeature } from '../../utils/testing/testable-feature.spec';
import { NuiFieldsModule } from '../fields.module';
import { NuiLabelDirective } from './label.directive';

@Component({
  template: '<label nui-label>Label</label>',
  standalone: true,
  imports: [NuiFieldsModule],
})
class TestComponent {}

const helper = new TestableFeature(
  TestComponent,
  NuiLabelDirective,
  '[nui-label]'
);

describe('Field label directive', () => {
  helper.prepareTestBed();

  helper.isCreated();
  helper.hasClass('nui-field-label');
  helper.canHandleAttribute('for');
});
