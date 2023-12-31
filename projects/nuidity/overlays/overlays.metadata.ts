import { DialogConfig } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

type CDKPrunedDialogConfig = Omit<
  DialogConfig,
  'scrollStrategy' | 'positionStrategy'
>;

type NuiDialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

type NuiDialogScroll = keyof typeof Overlay.prototype.scrollStrategies;

export type NuiDialogConfig = CDKPrunedDialogConfig &
  Partial<{
    position: NuiDialogPosition;
    scroll: NuiDialogScroll;
    closeOnRouting: boolean;
  }>;

export const NUI_DIALOG_CONFIG = new InjectionToken<NuiDialogConfig>(
  'NUI_DIALOG_CONFIG',
  {
    providedIn: 'root',
    factory: () => ({
      closeOnDestroy: true,
      closeOnNavigation: true,
      disableClose: false,
      hasBackdrop: true,
    }),
  }
);
