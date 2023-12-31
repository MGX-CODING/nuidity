# N-ui-dity library

## Features documentation

- [Overlays](./overlays/README.md)

## Library schematics

To provide a seamless DX experience, the library provides some schematics that you can use to integrate the library into your projects.

### Adding the library to your project

If you do not have a project yet, run

```bash
npx @angular/cli@latest new my-project-name
```

Once you have your project, you can run either one of these commands

```bash
# Interactive mode (preferred)
npx ng add @mgxdev/nuidity

# Quick mode with private theme
npx ng add @mgxdev/nuidity -p my-project-name -t true

# Quick mode with no theme
npx ng add @mgxdev/nuidity -p my-project-name -t false
```

This will setup your whole project and import everything you need (or if it fails, it will tell you)

In case you refuse to use the schematics, the process is as follows :

- Copy all files from `node_modules/@mgxdev/nuidity/schematics/common_files` into `[PROJECT_ROOT]/nuidity`
- Update your `app.module.ts`/`app.config.ts` file to provide the N-ui-dity configuration from the aforementioned folder
- Add a `stylePreprocessorOptions` to your project, referring to the `_core.scss` file in the aforementioned folder
- Update your main `.scss` file to include the core of the library into your application, using the preprocessor path

From there on, you can now run your `ng serve` command and use the library as much as you need !

### Creating a publishable theme

If you want to reuse the theme you have created, or simply share it with others, you can create an NPM library that will handle all of that for you.

After you have installed the N-ui-dity library, run

```bash
npx ng generate @mgxdev/nuidity:theme my-library-name
```

And it should create a theming library, ready to be published on NPM.

Note that you still should

- Update the library name into the library's `package.json`
- update the README file into the library's folder (this is the one shown on the NPM page of the library)
- Login into NPM with `npm login` before publishing your library
- Write some SCSS & TS code (duh)

## Providing global configurations

The file `nuidity.config.module.ts` contains all global configurations for every feature (refer to their documentation for more information).

A helper function is available for you to use, to ease the creation of providers.  
It both reduces the boilerplate, and provide autocompletion on the configuration object.

For example :

<!-- prettier-ignore -->
```typescript
// nuidity.config.module.ts

import { createGlobalConfiguration } from "@mgxdev/nuidity";
import { NUI_DIALOG_CONFIG } from "@mgxdev/nuidity/overlays";

// ...

const providers: Provider[] = [
  createGlobalConfiguration(NUI_DIALOG_CONFIG, { backdropClass: 'app-dialog-backdrop' })
];
```
