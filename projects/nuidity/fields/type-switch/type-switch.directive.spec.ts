import { By } from '@angular/platform-browser';
import {
  TestableFeature,
  createTestingComponent,
} from '../../utils/testing/testable-feature.spec';
import { NuiFieldsModule } from '../fields.module';
import { NuiInputDirective } from '../input/input.directive';
import { NuiTypeSwitchDirective } from './type-switch.directive';

const template = `<nui-field>
  <input type="password" nui-input />
  <button nui-suffix nui-type-switch #dir="currentType">
    @if (dir.type === 'password') { 👀 }
    @else if (dir.type === 'text') { 🔒 }
  </button>
</nui-field>`;

const cmp = createTestingComponent(template, [NuiFieldsModule], {});
const helper = new TestableFeature(
  cmp,
  NuiTypeSwitchDirective,
  '[nui-type-switch]'
);

describe('Field type switch directive', () => {
  helper.prepareTestBed();
  helper.isCreated();

  it('Is able to switch between types', () => {
    const { feature, fixture } = helper;

    const query = fixture.debugElement.query(By.directive(NuiInputDirective));
    const input = query.injector.get(NuiInputDirective);
    const element: HTMLInputElement = query.nativeElement;

    feature.types = ['password', 'a', 'b', 'c', 'd'];
    input.type = 'password';

    fixture.detectChanges();

    function check(value: string) {
      expect(element.getAttribute('type')).toEqual(value);
      expect(input.type).toEqual(value);
      expect(feature.type).toEqual(value);
      feature['onClick']();
      fixture.detectChanges();
    }

    check('password');
    check('a');
    check('b');
    check('c');
    check('d');
    check('password');
    check('a');
    check('b');
    check('c');
    check('d');
  });
});
