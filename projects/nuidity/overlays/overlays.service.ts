import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import { delay, filter, take, tap } from 'rxjs';
import { NUI_DIALOG_CONFIG, NuiDialogConfig } from './overlays.metadata';

type DialogArgs<R, D, C> = Parameters<typeof Dialog.prototype.open<R, D, C>>;

@Injectable()
export class NuiOverlaysService {
  private cdkDialog = inject(Dialog);
  private cdkOverlay = inject(Overlay);
  private globalDialogConfig = inject(NUI_DIALOG_CONFIG);
  private router = inject(Router, { optional: true });

  /**
   * Creates a dialog positionned globally
   * @param view Component or TemplateRef to display
   * @param options Dialog configuration that will overwrite the global one
   * @returns A dialog ref to control the dialog opened
   */
  dialog<R, D, C>(view: DialogArgs<R, D, C>[0], options?: NuiDialogConfig) {
    const merged = {
      ...this.globalDialogConfig,
      ...options,
    };

    const configuration: DialogArgs<R, D, C>[1] = {
      ...((merged ?? {}) as DialogConfig<D, DialogRef<R, C>>),
      positionStrategy: this.buildPosition(merged?.position),
      scrollStrategy:
        this.cdkOverlay.scrollStrategies[merged?.scroll ?? 'noop'](),
    };

    const ref = this.cdkDialog.open<R, D, C>(view, configuration);

    if (merged.closeOnNavigation && this.router) this.closeOnRouting(ref);

    return ref;
  }

  private buildPosition(position: NuiDialogConfig['position']) {
    let strategy = this.cdkOverlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    if (!position) return strategy;
    if (position.includes('bottom')) strategy = strategy.bottom();
    if (position.includes('top')) strategy = strategy.top();
    if (position.includes('left')) strategy = strategy.left();
    if (position.includes('right')) strategy = strategy.right();

    return strategy;
  }

  private closeOnRouting<R, D>(ref: DialogRef<R, D>) {
    this.router?.events
      .pipe(
        filter(
          (v) => v instanceof NavigationEnd || v instanceof NavigationSkipped
        ),
        take(1)
      )
      .subscribe(() => ref.close());
  }
}
