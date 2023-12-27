# N-ui-dity : Angular library for features, without styles

## Table of contents

- [What is this library ?](#what-is-this-library)
- [Quickstart](#quickstart)
- [Library schematics](./documentation/schematics.md)
  - [Adding the library to your project](./documentation/schematics.md#adding-the-library-to-your-project)
  - [Creating a publishable theme](./documentation/schematics.md#creating-a-publishable-theme)

## What is this library ?

This is a library made for Angular (version 17 and above) that aims to provide easy-to-use features like (but not only)

- Form fields (date picker, time picker, select, autocomplete, masks ...)
- Overlays (dialogs, notifications, alerts, prompts, confirms ...)
- QoL features (hotkeys, animations, testing ...)

And it also aims to provide all of those features, **without any style**.  
This means that when using the library, you have to **style it yourself !**

But do not worry, people can make & share styles very easily for this library.  
You can of course, make your own design system, and share it (or not) with the world.  
For more information, you just have to refer to the documentation !

Here are some widely used styles with this library :

- _Coming soon_

## Quickstart

```bash
# Only if you do not have a project yet
npx @angular/cli@latest new my-project-name
cd my-project-name

# ---

npx ng add @mgxdev/nuidity -p my-project-name -t true
npx ng serve my-project-name
```
