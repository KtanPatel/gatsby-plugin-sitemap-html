# gatsby-plugin-sitemap-html

[![npm version](https://badge.fury.io/js/gatsby-plugin-sitemap-html.svg)](https://www.npmjs.com/package/gatsby-plugin-sitemap-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/KtanPatel/gatsby-plugin-sitemap-html/actions/workflows/ci.yml/badge.svg)](https://github.com/KtanPatel/gatsby-plugin-sitemap-html/actions)
[![codecov](https://codecov.io/gh/KtanPatel/gatsby-plugin-sitemap-html/branch/main/graph/badge.svg)](https://codecov.io/gh/KtanPatel/gatsby-plugin-sitemap-html)

A Gatsby plugin that extends `gatsby-plugin-sitemap` to generate **human-readable, HTML-styled sitemaps**. Supports XSL-based styling and a pure HTML sitemap page — keeping XML clean for search engines while giving users a beautiful browser experience.

## ✨ Features

- 🎨 **Beautiful HTML styling** - Makes sitemaps human-readable in browsers
- 🔧 **Zero configuration** - Works out of the box with sensible defaults
- 🎯 **Customizable** - Bring your own XSL template if needed
- 📦 **Lightweight** - Minimal dependencies
- 🚀 **SEO-friendly** - Maintains XML structure for search engines
- 🔄 **Automatic processing** - Handles sitemap index and all sitemap files
- 📄 **HTML sitemap page** - Optionally generate a pure HTML sitemap at `/sitemap` (no XSL required)

## 📦 Installation

```bash
pnpm add gatsby-plugin-sitemap gatsby-plugin-sitemap-html
```

Or with npm:

```bash
npm install gatsby-plugin-sitemap gatsby-plugin-sitemap-html
```

Or with yarn:

```bash
yarn add gatsby-plugin-sitemap gatsby-plugin-sitemap-html
```

## 🚀 Quick Start

Add the plugin to your `gatsby-config.js`. **Important:** Add it after `gatsby-plugin-sitemap`:

```js
module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.example.com',
  },
  plugins: ['gatsby-plugin-sitemap', 'gatsby-plugin-sitemap-html'],
};
```

That's it! Build your site and visit `/sitemap.xml` in your browser to see the styled sitemap.

## ⚙️ Configuration

### Basic Configuration

```js
module.exports = {
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        // Optional: path to custom XSL template
        xslTemplate: `${__dirname}/src/templates/custom-sitemap.xsl`,
      },
    },
  ],
};
```

### Pure XML + HTML Sitemap Page (Recommended)

Chrome is deprecating XSLT support. To future-proof your sitemap, disable XSL and generate a standalone HTML sitemap page instead:

```js
module.exports = {
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        xsl: false, // pure XML for search engines
        htmlSitemap: { enabled: true }, // HTML page at /sitemap (default path)
      },
    },
  ],
};
```

Visit `/sitemap.xml` for the raw XML and `/sitemap` for the styled HTML page.

### HTML Sitemap with Custom Path (Object Shape)

```js
module.exports = {
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        xsl: false,
        htmlSitemap: { enabled: true, path: '/sitemap-html' },
      },
    },
  ],
};
```

### HTML Sitemap with Custom Path (Deprecated Boolean Shape)

The boolean `htmlSitemap: true` with separate `htmlSitemapPath` still works but is deprecated:

```js
module.exports = {
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        xsl: false,
        htmlSitemap: true,
        htmlSitemapPath: '/sitemap-html', // deprecated, use htmlSitemap.path instead
      },
    },
  ],
};
```

### Custom Output Path

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/sitemaps',
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        output: '/sitemaps', // Must match gatsby-plugin-sitemap
      },
    },
  ],
};
```

### Custom Sitemap Filename

```js
module.exports = {
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        sitemapFilename: 'custom-sitemap.xml',
      },
    },
  ],
};
```

### Options

| Option          | Type                | Default           | Description                                                                             |
| --------------- | ------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| xsl             | boolean             | `true`            | Inject XSL stylesheet reference into XML sitemaps. Set `false` for pure XML             |
| xslTemplate     | string              | built-in template | Path to a custom XSL template file. Only used when `xsl: true`                          |
| htmlSitemap     | boolean \| object   | `false`           | Generate a styled HTML sitemap page. Use `true` or `{ enabled: true, path: '/custom' }` |
| htmlSitemapPath | string (deprecated) | `/sitemap`        | Path where the HTML sitemap page is generated. Use `htmlSitemap.path` instead           |
| output          | string              | `/`               | Folder path where sitemaps are stored (must match gatsby-plugin-sitemap)                |
| sitemapFilename | string              | `sitemap.xml`     | Custom filename for the main sitemap file (renamed from sitemap-index.xml)              |

## 📖 How It Works

1. `gatsby-plugin-sitemap` generates your sitemap files (`sitemap-index.xml`, `sitemap-0.xml`, etc.)
2. This plugin automatically:
   - Injects XSL references into all sitemap files _(when `xsl: true`)_
   - Copies the XSL stylesheet to your public directory _(when `xsl: true`)_
   - Generates a static HTML sitemap page _(when `htmlSitemap: true`)_
   - Renames `sitemap-index.xml` to `sitemap.xml` (or custom filename via `sitemapFilename` option)
3. Search engines always see standard XML — XSL processing instructions are ignored by crawlers
4. Users get a beautiful, styled view — either via XSL in the browser or the dedicated HTML page

## 🌐 XSL vs HTML Sitemap

|                     | XSL (`xsl: true`)            | HTML Sitemap (`htmlSitemap: true`) |
| ------------------- | ---------------------------- | ---------------------------------- |
| Browser support     | Chrome deprecating XSLT soon | All browsers, forever              |
| Separate URL needed | No (`/sitemap.xml`)          | Yes (`/sitemap`)                   |
| XML stays clean     | No (XSL PI injected)         | Yes                                |
| Custom styling      | Via custom XSL file          | Via `htmlSitemapPath` page         |
| Recommended for     | Legacy / existing setups     | New projects                       |

You can enable both at the same time if needed.

## 🎨 Custom XSL Styling

To customize the XSL appearance:

1. Copy the built-in template from `node_modules/gatsby-plugin-sitemap-html/templates/sitemap.xsl`
2. Modify the styles and layout as needed
3. Reference it in your config:

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    xslTemplate: './src/templates/my-sitemap.xsl',
  },
}
```

## 📚 Documentation

- [API Reference](./docs/API.md) - Detailed API documentation
- [Examples](./docs/EXAMPLES.md) - More usage examples and configurations
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🔍 Example

Check the [`example`](./example) directory for a complete working demo.

To run the example:

```bash
cd example
pnpm install
pnpm run build
pnpm run serve
```

Then visit:

- `http://localhost:9000/sitemap.xml` — XSL styled XML sitemap
- `http://localhost:9000/sitemap` — HTML sitemap page

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

Please note that this project is released with a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 🔒 Security

See our [Security Policy](./SECURITY.md) for reporting vulnerabilities.

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## 📄 License

MIT © [Ketan Patel](https://github.com/KtanPatel)

## 🙏 Acknowledgments

- Built on top of [gatsby-plugin-sitemap](https://www.gatsbyjs.com/plugins/gatsby-plugin-sitemap/)
- Inspired by the need for human-readable sitemaps

---

If you find this plugin helpful, please ⭐ star the repo!
