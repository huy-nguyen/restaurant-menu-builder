const del = require('delete')

// The type definition inside package `redux-mock-store` is out-of-date with
// that in `redux`, which causes compilation error. The only way to fix this is
// for the author of `redux-mock-store` to fix the type definition because there
// are no  `@types` definitions for `redux-mock-store` (definitions built into a
// package takes precedence over `@types` definition). A pull request has been
// submitted (https://github.com/arnaudbenard/redux-mock-store/pull/57). Until
// the pull request is accepted (at which point this fix will be removed), we'll
// have to manually remove the erroneous `index.d.ts` file from the package's
// directory because TypeScript won't exclude that file from the build even if
// we add it to the `exclude` array in `tsconfig.json`.
del.sync(['node_modules/redux-mock-store/index.d.ts'])
