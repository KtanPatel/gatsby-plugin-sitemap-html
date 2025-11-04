CONTRIBUTING
============

Thanks for contributing! A few notes about the project and a known CI/workflow issue so you don't get surprised.

Why the example build was removed from CI (short-term)
---------------------------------------------------
During CI runs we observed Gatsby's query extractor failing when it attempted to parse some transitive dependencies that ship TypeScript ESM declaration files (files ending in `.mts` or `.cts`). These files are not valid JS that Gatsby expects to parse for GraphQL fragments/queries, so Gatsby reports parsing errors and the example build fails.

This is a transitive dependency problem (packages such as `graphql-http` and `@graphql-codegen/*` in some versions). Pinning every transitive dependency to avoid `.mts`/`.cts` files is fragile and can require multiple iterations.

As a safe short-term workaround the CI workflow currently does NOT build the `example/` site. CI still runs tests and builds the package itself. This keeps CI stable while we decide on a long-term approach.

How to reproduce locally
------------------------
To reproduce the failing behavior locally (same steps CI would run):

```powershell
cd example
npm ci
npm run build
```

If you hit the same `.mts/.cts` parsing errors, see the long-term fixes below.

Long-term fixes (pick one)
--------------------------
1) Use `npm` `overrides` (or `yarn` `resolutions`) to pin problematic transitive packages to versions that do not ship `.mts`/`.cts` files.

Example `example/package.json` snippet (npm `overrides`):

```json
"overrides": {
  "graphql": "^16.8.1",
  "graphql-http": "1.19.0",
  "@graphql-codegen/plugin-helpers": "4.1.0"
}
```

After editing `package.json` run:

```powershell
cd example
npm ci
npm run build
```

2) Add a transpilation step for the problematic node_modules so Gatsby can parse them.

- Use a plugin that allows compiling/transpiling node modules before Gatsby extracts queries. Example plugins or techniques:
  - `gatsby-plugin-compile-es6-packages` (or `gatsby-plugin-compile-modules`) configured with the package names that cause issues.

Add to your `example/gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-compile-es6-packages`,
      options: {
        modules: [
          `@graphql-codegen`,
          `graphql-http`
        ]
      }
    }
  ]
}
```

Then reinstall and rebuild the example:

```powershell
cd example
npm ci
npm run build
```

3) Run the example build in an environment that supports parsing `.mts`/`.cts` or transpile those files prior to Gatsby's extractor. This is more advanced and may not be worth the complexity for a small example.

4) Upstream fixes: Open issues / PRs against the upstream packages asking them to also publish CJS artifacts or avoid using `.mts`/`.cts` in distributed packages. This helps the ecosystem and is the cleanest long-term fix.

How to re-enable example build in CI
-----------------------------------
Once you have a working approach locally (either by overrides or transpilation), do the following:

1. Remove/adjust the `example`-exclusion note in `.github/workflows/ci.yml` and restore the `Build example` step.
2. Commit the fixes and push to `main`.
3. CI should now run example build successfully.

Example patch to restore the CI step (for reference):

```diff
-      # Install and build example
-      - name: Build example
-        run: |
-          cd example
-          npm ci
-          npm run build
+      - name: Build example
+        run: |
+          cd example
+          npm ci
+          npm run build
```

Notes and recommendations
-------------------------
- If you want me to attempt a deterministic fix for this repo I can try applying `overrides` (npm) or `resolutions` (yarn) and re-run installations until the example builds cleanly in CI. This may require several iteration cycles because transitive dependencies are numerous.
- If you prefer the transpilation approach I can add `gatsby-plugin-compile-es6-packages` to the `example/` site and configure the problematic modules; then we can re-enable building the example in CI.

Which approach would you prefer me to take next?
- Try `overrides`/`resolutions` and pin transitive deps (iterative but avoids extra plugins)
- Add a transpile plugin to the example and re-enable example build in CI
- Keep current state and only document (no further changes)

Thanks — pick an option and I'll proceed with the implementation and CI verification.
