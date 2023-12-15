import {
  TestableFeature,
  createTestingComponent,
} from '../../utils/testing/testable-feature.spec';
import { NuiFieldsModule } from '../fields.module';
import { NuiHintDirective } from './hint.directive';

describe('Field hint directive', () => {
  const cmp = createTestingComponent(
    '<span nui-hint>👎</span>',
    [NuiFieldsModule],
    {}
  );
  const helper = new TestableFeature(cmp, NuiHintDirective, '[nui-hint]');

  helper.prepareTestBed();
  helper.isCreated();
});
