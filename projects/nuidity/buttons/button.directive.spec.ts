import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LIB_PREFIX } from '../utils';
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

const ft = NuiButtonDirective['FEAT_NAME'];
const pf = LIB_PREFIX;

describe('Button directive', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let component: TestingComponent;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [TestingComponent],
    }).createComponent(TestingComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Gets created on use', () => {
    const directive = fixture.debugElement
      .query(By.directive(NuiButtonDirective))
      .injector.get(NuiButtonDirective);

    expect(directive).toBeDefined();
  });

  describe('"mode" @Input', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = fixture.debugElement.query(
        By.css('[nui-button]')
      ).nativeElement;
    });

    it('Works with simple string', () => {
      component.mode = 'icon';
      fixture.detectChanges();
      expect(element).toHaveClass(`${pf}-icon-${ft}`);
    });

    it('Works with composed string', () => {
      component.mode = 'icon flat';
      fixture.detectChanges();
      expect(element).toHaveClass(`${pf}-icon-${ft}`);
      expect(element).toHaveClass(`${pf}-flat-${ft}`);
    });

    it('Works with arrays', () => {
      component.mode = ['icon', 'flat'];
      fixture.detectChanges();
      expect(element).toHaveClass(`${pf}-icon-${ft}`);
      expect(element).toHaveClass(`${pf}-flat-${ft}`);
    });

    it('Works with malformed strings', () => {
      component.mode = '  icon    flat   ';
      fixture.detectChanges();
      expect(element).toHaveClass(`${pf}-icon-${ft}`);
      expect(element).toHaveClass(`${pf}-flat-${ft}`);
    });

    it('Works with malformed strings in arrays', () => {
      component.mode = ['  icon  ', ' flat '];
      fixture.detectChanges();
      expect(element).toHaveClass(`${pf}-icon-${ft}`);
      expect(element).toHaveClass(`${pf}-flat-${ft}`);
    });

    it('Works with composed strings in arrays', () => {
      component.mode = ['icon flat'];
      fixture.detectChanges();
      expect(element).toHaveClass(`${pf}-icon-${ft}`);
      expect(element).toHaveClass(`${pf}-flat-${ft}`);
    });

    it('Works with composed, malformed strings in arrays', () => {
      component.mode = ['   icon  flat  '];
      fixture.detectChanges();
      expect(element).toHaveClass(`${pf}-icon-${ft}`);
      expect(element).toHaveClass(`${pf}-flat-${ft}`);
    });
  });
});
