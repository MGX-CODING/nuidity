import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TestableFeature,
  createTestingComponent,
} from '../utils/testing/testable-feature.spec';
import { NuiDatepickerComponent } from './datepicker.component';
import { NuiDatepickerModule } from './datepicker.module';
import { compareDates } from '../utils';

describe('Date picker component', () => {
  describe('Default behavior', () => {
    const template =
      '<nui-datepicker [formControl]="control" ></nui-datepicker>';

    const comp = createTestingComponent(
      template,
      [NuiDatepickerModule, ReactiveFormsModule],
      { control: new FormControl(new Date(2000, 0, 1)) }
    );

    const helper = new TestableFeature(
      comp,
      NuiDatepickerComponent,
      'nui-datepicker'
    );

    helper.prepareTestBed();
    helper.isCreated();

    beforeEach(() => {
      helper.feature['locale'] = 'en-US';
      helper.component.control.setValue(new Date(2000, 0, 1));
      helper.feature['weekStart'] = 1;
    });

    describe('Translations & formats', () => {
      it('Formats months', () => {
        const { feature, fixture } = helper;
        const month = () =>
          helper.getHtmlElement('.nui-datepicker-month-select span');

        const match = (
          format: (typeof feature)['monthFormat'],
          regex: string
        ) => {
          feature['monthFormat'] = format;
          feature.ngOnChanges();
          fixture.detectChanges();

          expect(month().textContent).toMatch(new RegExp(`^${regex}$`, 'i'));
        };

        match('short', 'jan');
        match('narrow', 'j');
        match('long', 'january');
        match('2-digit', '01');
        match('numeric', '1');
      });

      it('Formats days', () => {
        const { feature, fixture } = helper;

        const days = () =>
          helper
            .getHtmlElements('.nui-datepicker-day-name')
            .map((v) => v.textContent);

        const match = (
          format: (typeof feature)['dayFormat'],
          expecations: string[]
        ) => {
          feature['dayFormat'] = format;
          feature.ngOnChanges();
          fixture.detectChanges();

          let _days = days();
          for (let i = 0; i < _days.length; i++) {
            const d = _days[i];
            expect(d).toMatch(new RegExp(`^${expecations[i]}$`, 'i'));
          }
        };

        match('short', ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
        match('narrow', ['m', 't', 'w', 't', 'f', 's', 's']);
        match('long', [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ]);
      });

      it('Translates months & days', () => {
        const { feature, fixture } = helper;

        feature['locale'] = 'fr-FR';
        feature['monthFormat'] = 'long';
        feature['dayFormat'] = 'long';

        feature.ngOnChanges();
        fixture.detectChanges();

        const month = helper.getHtmlElement(
          '.nui-datepicker-month-select span'
        );
        const days = helper.getHtmlElements('.nui-datepicker-day-name');

        expect(month.textContent).toMatch(/^janvier$/i);
        expect(days[0].textContent).toMatch(/^lundi$/i);
      });
    });

    it('Makes a full, filled calendar view', () => {
      const dates = helper
        .getHtmlElements('.nui-datepicker-calendar-date')
        .map((v) => v.textContent?.trim());

      expect(dates[0]).toEqual('27');
      expect(dates.at(-1)).toEqual('06');
    });

    it('Handles year change', () => {
      const [prev, next] = helper.getHtmlElements(
        '.nui-datepicker-year-select button'
      ) as HTMLButtonElement[];

      prev.click();
      helper.fixture.detectChanges();

      expect(
        helper.getHtmlElement('.nui-datepicker-year-select span').textContent
      ).toEqual('1999');

      next.click();
      next.click();
      helper.fixture.detectChanges();

      expect(
        helper.getHtmlElement('.nui-datepicker-year-select span').textContent
      ).toEqual('2001');
    });

    it('Handles month change', () => {
      helper.feature['monthFormat'] = 'long';
      helper.feature.ngOnChanges();

      const [prev, next] = helper.getHtmlElements(
        '.nui-datepicker-month-select button'
      ) as HTMLButtonElement[];

      prev.click();
      helper.fixture.detectChanges();

      expect(
        helper.getHtmlElement('.nui-datepicker-month-select span').textContent
      ).toMatch(/^december$/i);

      next.click();
      next.click();
      helper.fixture.detectChanges();

      expect(
        helper.getHtmlElement('.nui-datepicker-month-select span').textContent
      ).toMatch(/^february$/i);
    });

    it('Defaults to current date in case date is invalid', () => {
      helper.feature['updateCalendar']('');
      expect(compareDates(helper.feature['displayDate'], new Date())).toBeTrue();
    });
  });

  describe('With form control', () => {
    const template =
      '<nui-datepicker [formControl]="control" ></nui-datepicker>';

    const comp = createTestingComponent(
      template,
      [NuiDatepickerModule, ReactiveFormsModule],
      { control: new FormControl(new Date(2000, 0, 1)) }
    );

    const helper = new TestableFeature(
      comp,
      NuiDatepickerComponent,
      'nui-datepicker'
    );

    helper.prepareTestBed();

    beforeEach(() => {
      helper.feature['locale'] = 'en-US';
      helper.component.control.setValue(new Date(2000, 0, 1));
      helper.feature['weekStart'] = 1;
    });

    it('Goes to the correct view depending on the control', () => {
      const { feature, fixture, element, component } = helper;

      component.control.setValue(new Date(1993, 1, 27));
      fixture.detectChanges();

      const year = helper.getHtmlElement('.nui-datepicker-year-select span');
      const month = helper.getHtmlElement('.nui-datepicker-month-select span');

      expect(year.textContent).toEqual('1993');
      expect(month.textContent).toMatch(/feb/i);
    });

    it('Updates the form control value', () => {
      const { fixture, component } = helper;

      const target = helper
        .getHtmlElements('.nui-datepicker-calendar-date')
        .find((v) => v.textContent?.trim() === '15') as HTMLButtonElement;
      target!.click();
      fixture.detectChanges();

      expect(component.control.value).toEqual(new Date(2000, 0, 15));
    });
  });
});
