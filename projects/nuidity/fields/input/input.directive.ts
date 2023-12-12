import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[nui-input]' })
export class NuiInputDirective {
  /** Reference to the ngModel instance */
  public ngControl = inject(NgControl, { optional: true });

  /** Reference to the HTML element */
  public element: ElementRef<HTMLInputElement> = inject(ElementRef);

  /** Binding to the "type" attribute */
  @Input()
  @HostBinding('attr.type')
  public type?: string;

  /** Binding to the "id" attribute */
  @Input()
  @HostBinding('attr.id')
  public id?: string;
}
