import {
  TestableFeature,
  createTestingComponent,
} from '../../utils/testing/testable-feature.spec';
import { NuiFieldsModule } from '../fields.module';
import { NuiPrefixDirective, NuiSuffixDirective } from './fixes.directives';

describe('Field prefix directive', () => {
  const cmp = createTestingComponent(
    '<span nui-prefix>👎</span>',
    [NuiFieldsModule],
    {}
  );
  const helper = new TestableFeature(cmp, NuiPrefixDirective, '[nui-prefix]');

  helper.prepareTestBed();
  helper.isCreated();
});

describe('Field suffix directive', () => {
  const cmp = createTestingComponent(
    '<span nui-suffix>👎</span>',
    [NuiFieldsModule],
    {}
  );
  const helper = new TestableFeature(cmp, NuiSuffixDirective, '[nui-suffix]');

  helper.prepareTestBed();
  helper.isCreated();
});
