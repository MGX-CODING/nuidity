import { Directive, HostBinding, Input } from '@angular/core';
import { LIB_PREFIX, normalizeString } from '@mgxdev/nuidity/utils';

@Directive({ selector: '[nui-button]' })
export class NuiButtonDirective {
  private static FEAT_NAME = 'button';

  @Input({
    transform: (value: string | string[]) =>
      value
        ? (Array.isArray(value)
            ? value.map((v) => normalizeString(v).split(' ')).flat()
            : normalizeString(value).split(' ')
          )
            .map((v) => normalizeString(v))
            .map((cl) => `${LIB_PREFIX}-${cl}-${NuiButtonDirective.FEAT_NAME}`)
        : '',
  })
  @HostBinding('class')
  mode?: string | string[];
}
