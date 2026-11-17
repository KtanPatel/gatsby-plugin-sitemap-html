# API Documentation

## Plugin Options

### `xsl`

- **Type:** `boolean`
- **Default:** `true`
- **Optional:** Yes

Inject XSL stylesheet reference into XML sitemaps. Set to `false` for pure XML with no XSL processing instructions.

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    xsl: false, // pure XML, no XSL injection
  },
}
```

### `xslTemplate`

- **Type:** `string`
- **Default:** Built-in template
- **Optional:** Yes

Path to a custom XSL template file. Only used when `xsl: true`.

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    xslTemplate: './src/templates/custom-sitemap.xsl',
  },
}
```

### `htmlSitemap`

- **Type:** `boolean | { enabled?: boolean; path?: string }`
- **Default:** `false`
- **Optional:** Yes

Generate a styled HTML sitemap page at build time. The page uses a pure CSS accordion layout (no JavaScript) — click a sitemap entry to expand and see all its URLs.

Accepts either a boolean or an object:

- `htmlSitemap: true` — enabled with default path `/sitemap`
- `htmlSitemap: { enabled: true, path: '/custom' }` — enabled with custom path
- `htmlSitemap: false` — disabled

This is the recommended approach for new projects as it works in all browsers and is future-proof against Chrome's XSLT deprecation.

**Example (boolean):**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    xsl: false,
    htmlSitemap: true,
  },
}
```

**Example (object):**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    xsl: false,
    htmlSitemap: { enabled: true, path: '/sitemap-html' },
  },
}
```

### `htmlSitemapPath`

- **Type:** `string`
- **Default:** `/sitemap`
- **Optional:** Yes
- **Deprecated:** Use `htmlSitemap.path` instead. Still works for backward compatibility.

Path where the HTML sitemap page is generated. Only used when `htmlSitemap: true`.

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    htmlSitemap: true,
    htmlSitemapPath: '/sitemap-html', // deprecated, use htmlSitemap.path instead
  },
}
```

### `output`

- **Type:** `string`
- **Default:** `/`
- **Optional:** Yes

Folder path where sitemaps are stored. Must match the `output` option in `gatsby-plugin-sitemap`.

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap',
  options: {
    output: '/sitemaps',
  },
},
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    output: '/sitemaps', // Must match above
  },
}
```

### `sitemapFilename`

- **Type:** `string`
- **Default:** `sitemap.xml`
- **Optional:** Yes

Custom filename for the main sitemap index file (renamed from `sitemap-index.xml`).

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    sitemapFilename: 'custom-sitemap.xml',
  },
}
```

## Gatsby Hooks

### `onPostBuild`

This plugin implements the `onPostBuild` hook to process sitemap files after the build completes.

**What it does:**

1. Scans for sitemap files (`sitemap-index.xml`, `sitemap-0.xml`, etc.)
2. Injects XSL stylesheet references into each sitemap file _(when `xsl: true`)_
3. Copies the XSL template to the `public` directory _(when `xsl: true`)_
4. Generates a static HTML sitemap page _(when `htmlSitemap: true`)_
5. Renames `sitemap-index.xml` to `sitemap.xml` (or custom `sitemapFilename`)

## File Processing

### Sitemap Files Processed

The plugin automatically processes:

- `sitemap-index.xml` (renamed to `sitemap.xml`)
- `sitemap-0.xml`, `sitemap-1.xml`, etc. (all numbered sitemap files)

### XSL Injection

When `xsl: true` (default), the plugin injects an XSL stylesheet reference after the XML declaration. The `href` respects your `output` option:

```xml
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
```

If you set `output: '/sitemaps'`, the href becomes:

```xml
<?xml-stylesheet type="text/xsl" href="/sitemaps/sitemap.xsl"?>
```

When `xsl: false`, the XML files are left clean with no processing instructions.

### HTML Sitemap Generation

When `htmlSitemap: true`, the plugin:

1. Reads the sitemap index to get all child sitemap entries
2. Reads each child sitemap to extract all URLs
3. Generates a static `index.html` at `public/{htmlSitemapPath}/`
4. The HTML page shows sitemap entries as collapsible accordion sections (pure CSS, no JS)

## Custom XSL Templates

### Template Structure

A custom XSL template should:

1. Be a valid XSLT 1.0 stylesheet
2. Handle both sitemap index and urlset formats
3. Include proper namespaces

**Minimal example:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
      </head>
      <body>
        <h1>Sitemap</h1>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="sitemap:url">
    <div>
      <a href="{sitemap:loc}">
        <xsl:value-of select="sitemap:loc"/>
      </a>
    </div>
  </xsl:template>

</xsl:stylesheet>
```

### Available Data

Your XSL template has access to all standard sitemap fields:

**For URL entries:**

- `loc` - The URL
- `lastmod` - Last modification date
- `changefreq` - Change frequency
- `priority` - Priority value

**For sitemap index entries:**

- `loc` - The sitemap URL
- `lastmod` - Last modification date

## Error Handling

### Template Not Found

If `xsl: true` and the plugin cannot find the XSL template, it throws:

```
gatsby-plugin-sitemap-html: cannot find sitemap.xsl at <path>
```

**Solution:** Ensure the template exists at the specified path, or remove the `xslTemplate` option to use the built-in template. Alternatively, set `xsl: false` to skip XSL entirely.

### No Sitemap Files

If no sitemap files are found, the plugin completes silently. This can happen if:

- `gatsby-plugin-sitemap` is not installed
- `gatsby-plugin-sitemap` is configured to skip sitemap generation
- The build failed before sitemap generation

**Solution:** Ensure `gatsby-plugin-sitemap` is properly configured and listed before this plugin in `gatsby-config.js`.
