import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { NuiInputDirective } from '../input/input.directive';
import { NuiLabelDirective } from '../label/label.directive';

@Component({
  selector: 'nui-field',
  templateUrl: './field.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ng-pristine]': 'this.ngControl?.pristine',
    '[class.ng-dirty]': 'this.ngControl?.dirty',
    '[class.ng-pending]': 'this.ngControl?.pending',
    '[class.ng-touched]': 'this.ngControl?.touched',
    '[class.ng-untouched]': 'this.ngControl?.untouched',
    '[class.ng-valid]': 'this.ngControl?.valid',
    '[class.ng-invalid]': 'this.ngControl?.invalid',
    '[class.ng-disabled]': 'this.ngControl?.disabled',
    '[class.ng-required]': 'this.isRequired',
    '[class.ng-checked]': 'this.isChecked',
  },
})
export class NuiFieldComponent implements AfterContentInit {
  /** Reference to the nui-input directive */
  @ContentChild(NuiInputDirective) private inputDirective?: NuiInputDirective;

  /** Reference to the nui-label directive */
  @ContentChild(NuiLabelDirective) private labelDirective?: NuiLabelDirective;

  /** NgControl from the nui-input directive, only available after content init. */
  private get ngControl() {
    return this.inputDirective?.ngControl;
  }

  /** Getter that checks if the control has the required validator */
  private get isRequired() {
    return !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  /** For radios & checkboxes, to add the checked class to the host */
  private get isChecked() {
    return !!this.inputDirective?.element.nativeElement.checked;
  }

  /** Adds a class host depending on the input type */
  @HostBinding('class')
  private get inputTypeClass() {
    const type = this.inputDirective?.type;
    if (!type) return '';
    return `nui-${type}-field`;
  }

  ngAfterContentInit() {
    this.linkLabelAndInput();
  }

  /** Binds the nui-label and the nui-input together */
  private linkLabelAndInput() {
    if (!this.labelDirective || !this.inputDirective) return;

    const ref = Math.round(Date.now() * Math.random()).toString(36);

    const forvalue = this.labelDirective?.for;
    const idvalue = this.inputDirective?.id;

    if (!forvalue && idvalue) this.labelDirective.for = idvalue;
    else if (!idvalue && forvalue) this.inputDirective.id = forvalue;
    else if ((!forvalue && !idvalue) || forvalue !== idvalue) {
      this.inputDirective.id = ref;
      this.labelDirective.for = ref;
    }
  }
}
