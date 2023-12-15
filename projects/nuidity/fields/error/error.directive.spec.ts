import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  TestableFeature,
  createTestingComponent,
} from '../../utils/testing/testable-feature.spec';
import { NuiFieldsModule } from '../fields.module';

const template = `<nui-field>
  <input nui-input [formControl]="control" />

  <span *nui-error="'maxlength'" class="span-max">MAX_LENGTH</span>
  
  <ng-template nui-error="minlength" let-context let-min="requiredLength" let-curr="actualLength">
    <span class="span-min">MIN_LENGTH</span>
    <span class="implicit">{{ context.actualLength }}/{{ context.requiredLength }}</span>
    <span class="spreaded">{{ curr }}/{{ min }}</span>
  </ng-template>

</nui-field>`;

const comp = createTestingComponent(
  template,
  [NuiFieldsModule, ReactiveFormsModule],
  {
    control: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(12),
    ]),
  }
);

const helper = new TestableFeature(comp, comp, '.nui-field-errors');

describe('Field error directive', () => {
  helper.prepareTestBed();
  helper.isCreated();

  it('Displays no error when valid', () => {
    const { component, fixture, element } = helper;

    component.control.setValue('azertyuio');
    fixture.detectChanges();

    expect(element.textContent).toBeFalsy();
  });

  describe('With errors', () => {
    it('Handles template syntax, and handles template contexts properly', () => {
      const { component, fixture } = helper;

      component.control.setValue('aze');
      fixture.detectChanges();

      const spans = fixture.debugElement.queryAll(
        By.css('.nui-field-errors > span')
      );

      expect(spans[0].nativeElement.textContent).toEqual('MIN_LENGTH');
      expect(spans[1].nativeElement.textContent).toEqual('3/6');
      expect(spans[2].nativeElement.textContent).toEqual('3/6');
    });

    it('Handle structural directive syntax', () => {
      const { component, fixture } = helper;

      component.control.setValue('azertyuiopazertyuiop');
      fixture.detectChanges();

      const spans = fixture.debugElement.query(
        By.css('.nui-field-errors > span')
      );

      expect(spans.nativeElement.textContent).toEqual('MAX_LENGTH');
    });
  });
});
