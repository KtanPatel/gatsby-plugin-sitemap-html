# Troubleshooting

## Common Issues

### Sitemap not styled in browser

**Symptoms:** Visiting `/sitemap.xml` shows plain XML instead of styled HTML.

**Possible causes:**

1. **Plugin order incorrect**
   - Ensure `gatsby-plugin-sitemap-html` comes **after** `gatsby-plugin-sitemap` in your config

   ```js
   plugins: [
     'gatsby-plugin-sitemap', // ✅ First
     'gatsby-plugin-sitemap-html', // ✅ Second
   ];
   ```

2. **Build not completed**
   - The plugin runs during `onPostBuild`, so styling only applies after a full build
   - Run `gatsby build` (not `gatsby develop`)

3. **Browser caching**
   - Clear your browser cache or try in incognito mode
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### XSL template not found error

**Error message:**

```
gatsby-plugin-sitemap-html: cannot find sitemap.xsl in package
```

**Solutions:**

1. **Using custom template:**
   - Verify the path in your config is correct
   - Use absolute path: `${__dirname}/path/to/template.xsl`
   - Check file exists at the specified location

2. **Using default template:**
   - Reinstall the package: `npm install gatsby-plugin-sitemap-html`
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Sitemap files not processed

**Symptoms:** No sitemap files found or processed.

**Possible causes:**

1. **gatsby-plugin-sitemap not installed**

   ```bash
   npm install gatsby-plugin-sitemap
   ```

2. **siteUrl not configured**

   ```js
   // gatsby-config.js
   module.exports = {
     siteMetadata: {
       siteUrl: 'https://www.example.com', // Required!
     },
   };
   ```

3. **No pages to include**
   - Ensure your site has pages to include in the sitemap
   - Check `gatsby-plugin-sitemap` configuration

### Works locally but not in production

**Possible causes:**

1. **Build process differences**
   - Ensure production build runs `gatsby build`
   - Check deployment logs for errors

2. **File permissions**
   - Verify the build process can write to the public directory

3. **CDN caching**
   - If using a CDN, purge the cache for sitemap files
   - Wait for cache TTL to expire

### Custom XSL template not applying

**Symptoms:** Sitemap shows default styling instead of custom template.

**Solutions:**

1. **Check template path**

   ```js
   {
     resolve: 'gatsby-plugin-sitemap-html',
     options: {
       xslTemplate: `${__dirname}/src/templates/sitemap.xsl`, // Use __dirname
     },
   }
   ```

2. **Verify XSL syntax**
   - Ensure your XSL file is valid XSLT 1.0
   - Test the XSL file independently

3. **Clear build cache**
   ```bash
   gatsby clean
   gatsby build
   ```

### HTML sitemap page not generated

**Symptoms:** Visiting `/sitemap` shows 404 or the HTML page doesn't exist.

**Possible causes:**

1. **`htmlSitemap` not enabled**
   - Make sure `htmlSitemap: true` or `htmlSitemap: { enabled: true }` is set
   - Default is `false`, so it won't generate unless explicitly enabled

2. **Wrong path**
   - Check `htmlSitemapPath` or `htmlSitemap.path` matches the URL you're visiting
   - Default path is `/sitemap`

3. **Object shape not recognized**
   - If using `htmlSitemap: { enabled: true, path: '/custom' }`, ensure `enabled` is not `false`
   - Boolean `htmlSitemap: true` still works but is deprecated in favor of object shape

### XSL styling broken with custom output path

**Symptoms:** XSL stylesheet not found when using `output: '/sitemaps'` or similar.

**Cause:** Fixed in v1.3.1 — the XSL `href` now respects the `output` option.

**Solution:** Upgrade to `gatsby-plugin-sitemap-html@1.3.1` or later.

### Chrome XSLT deprecation warning

**Symptoms:** Chrome shows a red warning banner: "This site uses XSLT; that functionality is being removed from this browser very soon."

**Solution:** This is expected — Chrome is deprecating XSLT. Use one of these approaches:

1. **Recommended:** Set `xsl: false` and `htmlSitemap: { enabled: true }` for a pure HTML sitemap page
2. **Keep XSL:** XSL still works in Firefox and Safari, but will eventually stop working in Chrome
3. **Both:** Enable both `xsl: true` and `htmlSitemap: true` — crawlers get clean XML, browsers get either XSL or HTML

## Package Manager Specific Issues

### pnpm

If using pnpm, ensure the plugin can access its templates:

```bash
# In your project root
pnpm install gatsby-plugin-sitemap-html --shamefully-hoist
```

Or add to `.npmrc`:

```
shamefully-hoist=true
```

### Yarn PnP

For Yarn 2+ with PnP, you may need to adjust the resolution:

```js
// .yarnrc.yml
packageExtensions:
  gatsby-plugin-sitemap-html@*:
    dependencies:
      gatsby-plugin-sitemap: '*'
```

## Getting Help

If you're still experiencing issues:

1. Check [existing issues](https://github.com/KtanPatel/gatsby-plugin-sitemap-html/issues)
2. Create a [new issue](https://github.com/KtanPatel/gatsby-plugin-sitemap-html/issues/new) with:
   - Gatsby version
   - Node version
   - Package manager (npm/yarn/pnpm)
   - Full error message
   - Relevant config snippets
   - Steps to reproduce

## Debug Mode

To debug the plugin, check the build output:

```bash
gatsby build --verbose
```

Look for messages from `gatsby-plugin-sitemap-html` in the output.
