import { DialogRef } from '@angular/cdk/dialog';
import { Directive, HostListener, Input, inject } from '@angular/core';

@Directive({
  selector: '[nui-dialog-close]',
})
export class DialogCloseDirective {
  private ref = inject(DialogRef, { optional: true });

  @Input({
    alias: 'nui-dialog-close',
    transform: (v: any) => (v === '' ? null : v),
  })
  public closeData: any;

  constructor() {}

  @HostListener('click')
  private closeDialog() {
    this.ref?.close(this.closeData ?? null);
  }
}
