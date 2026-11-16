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
   * The HTML page uses a pure CSS accordion layout (no JavaScript).
   * @default false
   */
  htmlSitemap?: boolean;

  /**
   * Path where the HTML sitemap page is generated.
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
 *         xsl: true,                    // default: inject XSL for browser styling
 *         htmlSitemap: true,            // generate HTML page at /sitemap
 *         htmlSitemapPath: '/sitemap',  // default path
 *       },
 *     },
 *   ],
 * };
 * ```
 */
export const onPostBuild: GatsbyNode['onPostBuild'];
