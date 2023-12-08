import { Directive, HostBinding, Input } from '@angular/core';
import { LIB_PREFIX, normalizeString } from '@mgx/nuidity/utils';

/**
 * Directive that applies classes to buttons, in order to easily style them.
 *
 * @example```html
 * <button nui-button mode="icon">Icon button</button>             <!-- Code -->
 * <button nui-button class="nui-icon-button">Icon button</button> <!-- Result -->
 *
 * <button nui-button mode="icon flat">Flat icon button</button>                        <!-- Code -->
 * <button nui-button [mode]="['icon', 'flat']">Flat icon button</button>               <!-- Code -->
 * <button nui-button class="nui-icon-button nui-flat-button">Flat icon button</button> <!-- Result -->
 * ```
 */
@Directive({ selector: '[nui-button]' })
export class NuiButtonDirective {
  @Input({
    transform: (value: string | string[]) =>
      (Array.isArray(value) ? value : normalizeString(value).split(' '))
        .map((v) => normalizeString(v))
        .map((cl) => `${LIB_PREFIX}-${cl}-button`),
  })
  @HostBinding('class')
  mode?: string | string[];

  constructor() {}
}
