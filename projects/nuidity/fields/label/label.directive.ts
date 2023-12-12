import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[nui-label]',
  host: { '[class.nui-field-label]': 'true' },
})
export class NuiLabelDirective {
  /** binding to the "for" attribute */
  @Input()
  @HostBinding('attr.for')
  for?: string;
}
