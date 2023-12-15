import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[nui-error]',
})
export class NuiErrorDirective {
  /** Template reference to display the error */
  private templateRef = inject(TemplateRef);

  /** Input that holds the key of the error the form has */
  @Input({ alias: 'nui-error', required: true })
  error?: string;

  constructor() {}
}
