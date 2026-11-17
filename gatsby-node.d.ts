import { GatsbyNode } from 'gatsby';

export interface PluginOptions {
  /**
   * Path to a custom XSL template file.
   * If not provided, the plugin uses its built-in template.
   * Only used when `xsl: true`.
   * @example
   * ```js
   * {
   *   xslTemplate: './src/templates/custom-sitemap.xsl'
   * }
   * ```
   */
  xslTemplate?: string;

  /**
   * Inject XSL stylesheet reference into XML sitemaps.
   * Set to `false` for pure XML (no XSL processing instructions).
   * @default true
   */
  xsl?: boolean;

  /**
   * Generate a styled HTML sitemap page.
   * Accepts a boolean or an object with `enabled` and `path` properties.
   * The HTML page uses a pure CSS accordion layout (no JavaScript).
   * @default false
   * @example
   * ```js
   * {
   *   htmlSitemap: true
   * }
   * // or
   * {
   *   htmlSitemap: { enabled: true, path: '/sitemap-html' }
   * }
   * ```
   */
  htmlSitemap?: boolean | { enabled?: boolean; path?: string };

  /**
   * Path where the HTML sitemap page is generated.
   * @deprecated Use `htmlSitemap.path` instead. Still works for backward compatibility.
   * Only used when `htmlSitemap: true`.
   * @default '/sitemap'
   * @example
   * ```js
   * {
   *   htmlSitemapPath: '/sitemap-html'
   * }
   * ```
   */
  htmlSitemapPath?: string;

  /**
   * Folder path where sitemaps are stored.
   * Must match the output option in gatsby-plugin-sitemap.
   * @default '/'
   * @example
   * ```js
   * {
   *   output: '/sitemaps'
   * }
   * ```
   */
  output?: string;

  /**
   * Custom filename for the main sitemap file (renamed from sitemap-index.xml).
   * @default 'sitemap.xml'
   * @example
   * ```js
   * {
   *   sitemapFilename: 'custom-sitemap.xml'
   * }
   * ```
   */
  sitemapFilename?: string;
}

/**
 * Gatsby plugin that extends gatsby-plugin-sitemap to generate HTML-styled sitemaps.
 *
 * This plugin automatically:
 * - Injects XSL references into all sitemap files (when `xsl: true`)
 * - Copies the XSL stylesheet to your public directory (when `xsl: true`)
 * - Generates a static HTML sitemap page (when `htmlSitemap: true`)
 * - Renames sitemap-index.xml to sitemap.xml (or custom filename via `sitemapFilename`)
 *
 * @example
 * ```js
 * // gatsby-config.js
 * module.exports = {
 *   plugins: [
 *     'gatsby-plugin-sitemap',
 *     {
 *       resolve: 'gatsby-plugin-sitemap-html',
 *       options: {
 *         xsl: false,                              // pure XML for search engines
 *         htmlSitemap: { enabled: true, path: '/sitemap' },  // HTML page at /sitemap
 *       },
 *     },
 *   ],
 * };
 * ```
 */
export const onPostBuild: GatsbyNode['onPostBuild'];
