import { Component } from '@angular/core';
import { TestableFeature } from '../utils/testing/testable-feature.spec';
import { NuiButtonDirective } from './button.directive';
import { NuiButtonsModule } from './buttons.module';

@Component({
  template: '<button nui-button [mode]="mode"></button>',
  standalone: true,
  imports: [NuiButtonsModule],
})
class TestingComponent {
  mode?: string | string[];
}

const helper = new TestableFeature(
  TestingComponent,
  NuiButtonDirective,
  '[nui-button]'
);

describe('Button directive', () => {
  helper.prepareTestBed();
  helper.isCreated();

  describe('"mode" @Input', () => {
    const proceed = (mode: any, classes: string[]) => {
      const { component, fixture, element } = helper;
      component.mode = mode;
      fixture.detectChanges();
      for (const klass of classes)
        expect(element).toHaveClass(`nui-${klass}-button`);
    };

    it('Works with simple string', () => proceed('icon', ['icon']));

    it('Works with composed string', () =>
      proceed('icon flat', ['icon', 'flat']));

    it('Works with arrays', () => proceed(['icon', 'flat'], ['icon', 'flat']));

    it('Works with malformed strings', () =>
      proceed('  icon    flat   ', ['icon', 'flat']));

    it('Works with malformed strings in arrays', () =>
      proceed(['  icon  ', ' flat '], ['icon', 'flat']));

    it('Works with composed strings in arrays', () =>
      proceed(['icon flat'], ['icon', 'flat']));

    it('Works with composed, malformed strings in arrays', () =>
      proceed(['   icon  flat  '], ['icon', 'flat']));
  });
});
