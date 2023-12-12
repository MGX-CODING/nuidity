import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  TestableFeature,
  createTestingComponent,
} from '../../utils/testing/testable-feature.spec';
import { NuiFieldsModule } from '../fields.module';
import { NuiInputDirective } from '../input/input.directive';
import { NuiLabelDirective } from '../label/label.directive';
import { NuiFieldComponent } from './field.component';

const imports = [NuiFieldsModule, ReactiveFormsModule];

describe('Field component', () => {
  describe('Class bindings', () => {
    const comp = createTestingComponent(
      '<nui-field>   <input nui-input [type]="type" [formControl]="control" />   </nui-field>',
      imports,
      { control: new FormControl(''), type: 'text' }
    );
    const helper = new TestableFeature(comp, NuiFieldComponent, 'nui-field');

    helper.prepareTestBed();

    function checkClass(
      cb: (control: FormControl) => void,
      hasClass?: string,
      hasNotClass?: string
    ) {
      const { element, fixture, component } = helper;
      cb(component.control);
      fixture.detectChanges();
      if (hasClass) expect(element).toHaveClass(hasClass);
      if (hasNotClass) expect(element).not.toHaveClass(hasNotClass);
    }

    beforeEach(() => {
      Object.assign(helper.component, { control: new FormControl('') });
      helper.fixture.detectChanges();
    });

    it('Binds to interactions', () => {
      checkClass((c) => c.markAsTouched(), 'ng-touched', 'ng-untouched');
      checkClass((c) => c.markAsUntouched(), 'ng-untouched', 'ng-touched');
    });

    it('Binds to statuses', () => {
      checkClass((c) => c.markAsDirty(), 'ng-dirty', 'ng-pristine');
      checkClass((c) => c.markAsPristine(), 'ng-pristine', 'ng-dirty');
      checkClass((c) => c.markAsPending(), 'ng-pending');
    });

    it('Binds to validations', () => {
      checkClass(
        (c) => {
          c.clearValidators();
          c.setValue('');
          c.updateValueAndValidity();
        },
        'ng-valid',
        'ng-invalid'
      );
      checkClass(
        (c) => {
          c.addValidators(Validators.required);
          c.updateValueAndValidity();
        },
        'ng-invalid',
        'ng-valid'
      );
    });

    it('Binds to required', () =>
      checkClass((c) => c.addValidators(Validators.required), 'ng-required'));

    it('Binds to disabled', () =>
      checkClass((c) => c.disable(), 'ng-disabled'));

    it('Binds to checked', () => {
      helper.component.type = 'checkbox';
      helper.fixture.detectChanges();
      checkClass(
        (c) => {
          c.setValue(false);
          c.updateValueAndValidity();
        },
        '',
        'ng-checked'
      );
      checkClass((c) => {
        helper.fixture.debugElement
          .query(By.directive(NuiInputDirective))
          .nativeElement.click();
      }, 'ng-checked');
    });

    it('Binds to input type', () => {
      checkClass(
        () => (helper.component.type = 'testvalue'),
        'nui-testvalue-field'
      );
    });
  });

  describe('Label and input binding', () => {
    describe('Binds when', () => {
      function checkBinding(
        labelfor: '' | 'for="xxx"',
        inputid: '' | 'id="xxx"'
      ) {
        const template = `<nui-field><label nui-label ${labelfor}></label><input nui-input type="text" ${inputid} /></nui-field>`;
        const comp = createTestingComponent(template, imports, {});
        const helper = new TestableFeature(
          comp,
          NuiFieldComponent,
          'nui-field'
        );

        helper.prepareTestBed(false);
        helper.fixture.detectChanges();

        const label: HTMLLabelElement = helper.fixture.debugElement.query(
          By.directive(NuiLabelDirective)
        ).nativeElement;

        const input: HTMLInputElement = helper.fixture.debugElement.query(
          By.directive(NuiInputDirective)
        ).nativeElement;

        if (labelfor || inputid)
          expect(label.getAttribute('for')).toEqual('xxx');
        else expect(label.getAttribute('for')).not.toEqual('xxx');
        expect(label.getAttribute('for')).toEqual(input.getAttribute('id'));
      }

      it('Label OK, input not OK', () => checkBinding('for="xxx"', ''));
      it('Label not OK, input OK', () => checkBinding('', 'id="xxx"'));
      it('None OK', () => checkBinding('', ''));
      it('Both OK', () => checkBinding('for="xxx"', 'id="xxx"'));
    });
  });
});
