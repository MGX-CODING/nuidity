# `entrypoints` schematic

This is a simple schematic used to add secondary entrypoints to a library.

It creates both `index.ts` and `ng-package.json` at the right place, to have material-like imports for your library.

```bash
npx ng generate @mgx/nuidity:entrypoint
npx ng generate @mgx/nuidity:entrypoint NAME -p PROJECT
npx ng generate @mgx/nuidity:entrypoint -n NAME -p PROJECT
```

## Caveats :

- If you have a single library project, you can omit the `project` argument
  - _If you have none, or more than one, an error will occur when omitting it_
- If files already exists, an error will occur
- It only works if you have an `angular.json` file at the root of your project (suck it, Nx)
- It only works for `"projectType": "library"`
- **Do not forget to update the `index.ts` file with your exports !**
- If you use `ng generate service myservice --project mylib`, Angular will always append `lib` to the path
  - I advise you to rewrite the `path` property of your schematics in `angular.json` ([See how](../../../../angular.json#L71))
  - If you place your files elsewhere than where the schematic puts them, it won't give a neat path (e.g. `import from "mylib/src/lib/http"`)

## Running locally

If you are using `npx ng build nuidity --watch`, everytime you make a change, the schematic gets deleted.

To avoid that, run

```bash
npm run entrypoint -- FEATURE
```

This will compile and run the schematics instantly, so it should always work.
