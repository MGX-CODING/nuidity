import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { compareDates, normalizeDate } from '@mgxdev/nuidity/utils';

type CalendarDisplayDate = {
  date: Date;
  isIn?: boolean;
  selected?: boolean;
};

@Component({
  selector: 'nui-datepicker',
  templateUrl: './datepicker.component.html',
  styles: `:host { display: block; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuiDatepickerComponent implements ControlValueAccessor {
  private locale = inject(LOCALE_ID);
  private cdRef = inject(ChangeDetectorRef);

  // Display configuration
  private dayFormat: Intl.DateTimeFormatOptions['weekday'] = 'short';
  private monthFormat: Intl.DateTimeFormatOptions['month'] = 'long';
  protected weekStart = 1;
  protected yearButtonsMode = '';
  protected monthButtonsMode = '';
  protected dayButtonsMode = '';

  /** Date used to control the calendar display. No relation to the control itself. */
  protected displayDate = new Date();

  // Display variables
  protected dayNames = this.getDayNames();
  protected monthNames = this.getMonthNames();
  protected calendarDates = this.getCalendarDates();

  // Form control mode
  private ngControl = inject(NgControl, { optional: true });
  private onChange?: Function;
  private onTouch?: Function;

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  /** On changes, update the display according to the configuration */
  ngOnChanges() {
    this.dayNames = this.getDayNames();
    this.monthNames = this.getMonthNames();
    this.cdRef.detectChanges();
  }

  // Form control mode functions
  registerOnChange = (fn: any) => (this.onChange = fn);
  registerOnTouched = (fn: any) => (this.onTouch = fn);
  setDisabledState = (isDisabled: boolean) => {};
  writeValue(value: Date | number | string): void {
    this.updateCalendar(value);
  }

  /** Updates the selected datev when the user clicks on a date in the calendar */
  protected selectDate(date: Date) {
    this.onChange?.(date);
    this.updateCalendar(date);
  }

  /** Updates the year displayed in the calendar */
  protected changeYear(value: 1 | -1) {
    let clone = new Date(this.displayDate);
    clone = new Date(clone.setDate(15));
    clone = new Date(clone.setFullYear(clone.getFullYear() + value));
    this.updateCalendar(normalizeDate(clone, 0));
  }

  /** Updates the month displayed in the calendar */
  protected changeMonth(value: 1 | -1) {
    let clone = new Date(this.displayDate);
    clone = new Date(clone.setDate(15));
    clone = new Date(clone.setMonth(clone.getMonth() + value));
    this.updateCalendar(normalizeDate(clone, 0));
  }

  /** Updates the dates displayed in the calendar */
  private updateCalendar(date: Date | number | string) {
    const ref = normalizeDate(date);
    if (!ref.getTime()) this.displayDate = normalizeDate(new Date(), 0);
    else this.displayDate = normalizeDate(ref, 0);
    this.calendarDates = this.getCalendarDates();
    this.cdRef.detectChanges();
  }

  /** Returns an array of strings containing all days names, sorted by week start, and translated according to locale */
  private getDayNames() {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      weekday: this.dayFormat,
    });
    const duration = 3600 * 1000 * 24;

    const dates = new Array(7)
      .fill(0)
      .map((_, i) => new Date(Date.now() + i * duration))
      .sort((a, b) => a.getDay() - b.getDay());

    const sorted = [
      ...dates.slice(this.weekStart),
      ...dates.slice(0, this.weekStart),
    ];

    return sorted.map((date) => formatter.format(date));
  }

  /** Returns an array of strings containing all months names, sorted ascending, and translated according to locale */
  private getMonthNames() {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      month: this.monthFormat,
    });

    const cursor = new Date();
    const dates = new Array(12)
      .fill(0)
      .map(() => new Date(cursor.setMonth(cursor.getMonth() + 1)))
      .sort((a, b) => a.getMonth() - b.getMonth());

    return dates.map((date) => formatter.format(date));
  }

  /** Gets the current date related to the control */
  private getCurrentDate() {
    return this.ngControl?.value;
  }

  /** Creates an array of displayable dates for the calendar view */
  private getCalendarDates(): CalendarDisplayDate[] {
    const firstDay = new Date(normalizeDate(this.displayDate, 0).setDate(1));
    const monthRef = firstDay.getMonth();

    let cursor = firstDay;
    const dates = [];

    do {
      dates.push(new Date(cursor));
      cursor = new Date(cursor.setDate(cursor.getDate() + 1));
    } while (cursor.getMonth() === firstDay.getMonth());

    cursor = new Date(dates[0]);

    while (cursor.getDay() !== this.weekStart) {
      cursor = new Date(cursor.setDate(cursor.getDate() - 1));
      dates.unshift(new Date(cursor));
    }

    cursor = new Date(dates.at(-1)!);

    while (dates.length % 7) {
      cursor = new Date(cursor.setDate(cursor.getDate() + 1));
      dates.push(new Date(cursor));
    }

    return dates.map((date) => ({
      date,
      isIn: date.getMonth() === monthRef,
      selected: compareDates(date, this.getCurrentDate()),
    }));
  }
}
