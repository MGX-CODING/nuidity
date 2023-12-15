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

### With basic slots

The library provides optional, basic slots that allow you show information to the user :

- The prefix, which is usually before the input
- The suffix, which is usually after the input
- the label, which is usually used to describe the input
  - The label gets bound to the input automatically (`for`/`id` combo)
- The hint, which is usually used to give basic information about the input to the user

```html
<nui-field>
  <span nui-prefix> 👍 </span>
  <span nui-suffix> 👎 </span>
  <label nui-label> Username </label>
  <label nui-hint> Use a unique username </label>

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

### With error handling

```html
<nui-field>
  <input type="text" nui-input />

  <!-- Either syntax is fine, but see Caveats -->
  <span *nui-error="'required'">Required</span>
  <ng-template nui-error="required">
    <span>Required</span>
  </ng-template>

  <!-- Error is passed as context of the template (works only with ng-template syntax) -->
  <ng-template nui-error="minlength" let-context let-min="requiredLength" let-curr="actualLength">
    <!-- Again, either syntax is fine, see Caveats for details -->
    <span>Min length: {{ curr }} / {{ min }}</span>
    <span>Min length: {{ context.actualLength }} / {{ context.requiredLength }}</span>
  </ng-template>
</nui-field>
```

## Classes

The field and its children provide [several classes](/projects/nuidity/schematics/common_files/styles/features/_fields.scss) for you to style them.

## Caveats

The field works best with when you provide a form control / ngModel on the input.  
If not provided, class bindings won't work, since they rely on the `NgControl` injection to work.

### Type switcher

`#dir="currentType"` is a syntax to get the directive as the choosen variable (here, `dir`).  
You can rename `dir`, but not `currentType`.

By default, the switch happens between `password` and `text`.  
You can choose the types with `[nui-type-switch]="['date', 'time', 'email']"` if you really need.  
The order is important : the switch goes to the type after the current one (or goes back to the start if already at the end).

### Error handling

You can use either `<span *nui-error="'error'">` or `<ng-template nui-error="error">`, they'll both work fine.  
The difference is that when you use `<span>`, a span (or div, or X or Y) is created in the DOM tree.  
If you use `<ng-template>`, only the text is used : there is no containing element. This means if you have multiple errors, they'll get concatenated.  
To avoid that, you need to provide the HTML element yourself, in the `ng-template`.

To illustrate this, here is the rendered HTML for you to compare :

```html
<!-- Using span syntax -->
<div class="nui-errors">
  <span> Required </span>
  <span> E-mail </span>
</div>

<!-- Using ng-template syntax with no element around the text -->
<div class="nui-errors">Required E-mail</div>
```

When you use `ng-template` though, you get access to the template context.  
This is a mini-component that contains all of the error details, that are returned by the corresponding validator.

If you write `<ng-template let-X>`, it creates the variable `X`, which is the error itself.  
If you write `<ng-template let-X="message">`, it creates the variable `X`, which is the `message` property of the error.

If you don't know what the error returns (for instance, native angualr validators), you can write use the JSON pipe to discover the contents of it :

```html
<ng-template nui-error="minlength" let-err>
  <span>{{ err | json }}</span>
</ng-template>
```
