# Form fields

Form fields with awesome, easy-to-use features

## Import

```typescript
import { NuiFieldsModule } from "@mgxdev/nuidity/fields";
```

## Usage

### Minimal

```html
<nui-field>
  <!-- With either a form control, or a ngModel -->
  <input type="text" nui-input />
</nui-field>
```

### With text slots

```html
<nui-field>
  <span nui-prefix> 👍 </span>
  <span nui-suffix> 👎 </span>
  <label nui-label> Username </label>

  <input type="text" nui-input />
</nui-field>
```

### With type switcher

<!-- prettier-ignore -->
```html
<nui-field>
  <input type="text" nui-input />

  <button 
    nui-suffix 
    nui-type-switch 
    #dir="currentType"
  >
    @if (dir.type === 'password') { 👀 }
    @else if (dir.type === 'text') { 🔒 }
  </button>
</nui-field>
```

## Features

- Auto-binds the label and the input, so no need to add the `for` or `id` attributes (you can, just not required)
- Handles CSS classes on the parent element, for easy styling ([see classes](/projects/nuidity/schematics/common_files/styles/features/_fields.scss))
-

## Caveats

The field works best with when you provide a form control / ngModel on the input.  
If not provided, class bindings won't work, since they rely on the `NgControl` injection to work.

### Type switcher

`#dir="currentType"` is a syntax to get the directive as the choosen variable (here, `dir`).  
You can rename `dir`, but not `currentType`.

By default, the switch happens between `password` and `text`.  
You can choose the types with `[nui-type-switch]="['date', 'time', 'email']"` if you really need.  
The order is important : the switch goes to the type after the current one (or goes back to the start if already at the end).
