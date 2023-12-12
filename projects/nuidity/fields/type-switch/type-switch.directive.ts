import {
  ChangeDetectorRef,
  Directive,
  HostListener,
  Input,
  inject,
} from '@angular/core';
import { NuiFieldComponent } from '../field/field.component';

@Directive({ selector: '[nui-type-switch]', exportAs: 'currentType' })
export class NuiTypeSwitchDirective {
  private cd = inject(ChangeDetectorRef);

  /** Parent field injection */
  private field = inject(NuiFieldComponent);

  /** Reference to the input directive */
  private get input() {
    return this.field['inputDirective'];
  }

  /** Shortcut to the input type for exportAs */
  public get type() {
    return this.input?.type;
  }

  /** Types to switch between, defaults to password and text */
  @Input({
    alias: 'nui-type-switch',
    transform: (v: any) => v || ['password', 'text'],
  })
  types!: string | string[];

  /** Actual type switcher */
  @HostListener('click')
  private onClick() {
    if (!this.input) return;

    const typeIndex = this.types.indexOf(this.input?.type!);
    if (typeIndex === -1) return;

    const nextType = this.types.at(typeIndex + 1) ?? this.types.at(0);
    if (!nextType) return;

    this.input.type = nextType;
  }

  ngAfterViewInit() {
    /** Change detection after view init required, to avoid NG0100 error if exportAs is used */
    this.cd.detectChanges();
  }
}
