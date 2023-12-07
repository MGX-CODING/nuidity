# `entrypoints` schematic

This is a simple schematic used to add secondary entrypoints to a library.

```bash
npx ng generate @mgx/nuidity:entrypoint your_feature_name -p your_project
```

This will create the required `ng-package.json` alongside its dedicated `index.ts` file.

If the project name is not provided, and you have a single library in your projects, the schematics will use this library by default.

_(Note that having more or less than 1 library requires you to provide the project name)_
