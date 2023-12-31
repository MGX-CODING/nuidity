# Overlays

The overlay service is basically the CDK overlay service, with some quality of life changes.  
You can refer to their documentation for most of your needs :

- [CDK Documentation : dialogs](https://material.angular.io/cdk/dialog/overview)
- [CDK Documentation : overlays](https://material.angular.io/cdk/overlay/overview)
- [CDK Documentation : portals](https://material.angular.io/cdk/portal/overview)

## Usage

### Imports

```typescript
// Module import
import { NuiOverlaysModule } from "@mgxdev/nuidity/overlays";

// Service import
import { NuiOverlaysService } from "@mgxdev/nuidity/overlays";

// Injection tokens
import { NUI_DIALOG_CONFIG } from "@mgxdev/nuidity/overlays";
```

### Service functions

```typescript
dialog(component: Component | TemplateRef, configuration: NuiDialogConfig);
```

## Feature : dialog-closing directive

When you're in a dialog component or template, you can use the `nui-dialog-close` helper directive to close the corresponding dialog.  
If you provide no value to the directive, it returns `null` on the `ref.closed` observable.

<!-- prettier-ignore -->
```html
<button nui-dialog-close>Cancel</button>
<button [nui-dialog-close]="true">Confirm</button>
```

## Feature : dialogs

### Configuration

The configuration is the same as the CDK, except for 3 new properties :

- `position`, a string literal representing the position of the dialog (replaces `positionStrategy`)
- `scroll`, a string literal representing the scrolling behavior (replaces `scrollStrategy`),
- `closeOnRouting`, a boolean that closes the dialog when the user uses Angular router

You can provide a global configuration with the injection token `NUI_DIALOG_CONFIG`, or provide an in-place configuration when calling the function.  
Both configurations are merged, with the in-place configuration taking priority over the global one.

### Styling

The default structure of the dialog is as follows :

```text
body
  .cdk-overlay-container
    .cdk-overlay-backdrop                             (customizable, "backdropClass")
    .cdk-global-overlay-wrapper
      .cdk-overlay-pane                               (customizable, "panelClass")
        cdk-dialog-container.cdk-dialog-container     (customizable, "container")
          [your component / template]
```

If you use no theme, you can import the default styles of the CDK dialog for a quick styling :

```scss
@import "@angular/cdk/overlay-prebuilt.css";
```

Otherwise, know that the `positionStrategy` of the dialog relies on flexboxes.  
This means `.cdk-global-overlay-wrapper` should have a `display: flex` to work as intended.
