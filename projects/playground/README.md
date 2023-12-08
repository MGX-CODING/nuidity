# Playground application

The purpose of this application is simply to have something to test the library against.

This is a better DX than having to install the library on another project and hassle to make it work, right ?

## Caveats

- When trying features, import them from `@nuidity/FEATURE` to avoid angular caching.
- If you want to test in a real situation, you can run :

```bash
npx ng build nuidity --watch
```

```bash
npm i ./dist/nuidity
```

```bash
npx ng serve playground
```

```typescript
// Import from the packages for a real situation simulation
import {} from `@mgx/nuidity/FEATURE`;
```

Be aware that when doing so, angular caching is enabled : any changes to the library will not be detected until you clean the cache and re-run the `serve` command.
