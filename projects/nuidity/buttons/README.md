# Button directive

Simple directive that unifies classes on button elements.

## Import

```typescript
import { NuiButtonsModule } from "@mgxdev/nuidity/buttons";
```

## Usage

```html
<button nui-button mode="icon">Icon button</button>
<button nui-button mode="icon flat">Flat icon button</button>
<button nui-button [mode]="['icon', 'flat']">Flat icon button</button>
```

The `mode` input transforms the provided strings into classes, used for styling :

```html
<button class="nui-icon-button nui-flat-button">Flat icon button</button>
```
