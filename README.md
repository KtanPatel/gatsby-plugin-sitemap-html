# gatsby-plugin-sitemap-html

A Gatsby plugin that extends `gatsby-plugin-sitemap` to generate HTML-styled sitemaps using XSL. This plugin automatically adds an XSL stylesheet to your sitemap, making it human-readable when opened in a browser.

## Installation

```bash
npm install gatsby-plugin-sitemap gatsby-plugin-sitemap-html
```

## Usage

Add the plugin to your `gatsby-config.js`. Make sure to add it **after** `gatsby-plugin-sitemap`:

```js
module.exports = {
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-sitemap-html`,
      options: {
        // Optional: path to custom XSL template
        xslTemplate: `${__dirname}/src/templates/sitemap.xsl`,
      },
    },
  ],
};
```

## Features

- Automatically adds XSL styling to your sitemap.xml
- Makes sitemaps human-readable in browsers
- Customizable XSL template
- Works alongside gatsby-plugin-sitemap
- Zero configuration required

## Options

| Option      | Type   | Default           | Description                      |
| ----------- | ------ | ----------------- | -------------------------------- |
| xslTemplate | string | built-in template | Path to custom XSL template file |

## Example

Check the `example` directory for a working demo of the plugin.

## License

MIT
