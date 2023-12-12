# Form fields

Form fields with awesome, easy-to-use features

## Import

```typescript
import { NuiFieldsModule } from "@mgxdev/nuidity/fields";
```

## Usage

```html
<nui-field>
  <label nui-label>Username</label>
  <input type="text" nui-input />
</nui-field>
```

## Features

- Auto-binds the label and the input, so no need to add the `for` or `id` attributes (you can, just not required)
- Handles CSS classes on the parent element, for easy styling ([see classes](/projects/nuidity/schematics/common_files/styles/features/_fields.scss))

## Caveats

The field works best with when you provide a form control / ngModel on the input.  
If not provided, class bindings won't work, since they rely on the `NgControl` injection to work.