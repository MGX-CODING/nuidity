import { Directive, HostBinding, Input } from '@angular/core';
import { normalizeString } from '@mgxdev/nuidity/utils';

@Directive({ selector: '[nui-button]' })
export class NuiButtonDirective {
  @Input({
    transform: (value: string | string[]) =>
      value
        ? (Array.isArray(value)
            ? value.map((v) => normalizeString(v).split(' ')).flat()
            : normalizeString(value).split(' ')
          )
            .map((v) => normalizeString(v))
            .map((cl) => `nui-${cl}-button`)
        : '',
  })
  @HostBinding('class')
  mode?: string | string[];
}
