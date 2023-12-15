import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  HostBinding,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { map, startWith, tap } from 'rxjs';
import { NuiErrorDirective } from '../error/error.directive';
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
  private destroyRef = inject(DestroyRef);
  private cdRef = inject(ChangeDetectorRef);

  /** Reference to the nui-input directive */
  @ContentChild(NuiInputDirective) private inputDirective?: NuiInputDirective;

  /** Reference to the nui-label directive */
  @ContentChild(NuiLabelDirective) private labelDirective?: NuiLabelDirective;

  /** Reference to the nui-error directives provided */
  @ContentChildren(NuiErrorDirective)
  private errors?: QueryList<NuiErrorDirective>;

  /** Reference to the HTML slot where the errors are displayed */
  @ViewChild('errorsView', { read: ViewContainerRef })
  private errorsView?: ViewContainerRef;

  /** NgControl from the nui-input directive, only available after content init. */
  private get ngControl() {
    return this.inputDirective?.['ngControl'];
  }

  /** Getter that checks if the control has the required validator */
  private get isRequired() {
    return !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  /** For radios & checkboxes, to add the checked class to the host */
  private get isChecked() {
    return !!this.inputDirective?.['element'].nativeElement.checked;
  }

  /** Adds a class host depending on the input type */
  @HostBinding('class')
  private get inputTypeClass() {
    const type = this.inputDirective?.['type'];
    if (!type) return '';
    return `nui-${type}-field`;
  }

  ngAfterContentInit() {
    this.linkLabelAndInput();
  }

  ngAfterViewInit() {
    this.manageControlErrors();
    // Change detection required to avoid NG0100 error on first call
    this.cdRef.detectChanges();
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

  /** Listen to control value changes and show the corresponding errors accordingly */
  private manageControlErrors() {
    this.ngControl?.valueChanges
      ?.pipe(
        startWith(this.ngControl.value),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.errorsView?.clear()),
        map(() => this.errors?.toArray() ?? []),
        map((templates) =>
          templates.reduce(
            (p, n) => ({ ...p, [n.error!]: n['templateRef'] }),
            {} as Record<string, TemplateRef<any>>
          )
        ),
        map((templates) => ({
          templates,
          control: this.ngControl?.errors ?? {},
        })),
        map(({ control, templates }) =>
          Object.entries(control)
            .map(([key, context]) => ({
              template: templates[key],
              context: { ...context, $implicit: context },
            }))
            .filter((v) => !!v.template)
        )
      )
      .subscribe((errors) => {
        for (const { context, template } of errors)
          this.errorsView?.createEmbeddedView(template, context);
      });
  }
}
