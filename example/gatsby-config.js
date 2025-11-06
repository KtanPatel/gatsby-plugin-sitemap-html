/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    siteUrl: `http://localhost:9000`,
    title: `Example Gatsby Site`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      // Transpile problematic packages that ship .mts/.cts or untranspiled TS sources
      // so Gatsby's query extractor won't try to parse them directly.
      resolve: `gatsby-plugin-compile-es6-packages`,
      options: {
        modules: [
          `@graphql-codegen`,
          `@graphql-codegen/*`,
          `graphql-http`,
          `@graphql-tools`,
          `@graphql-tools/*`,
          `rxjs`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap-html`,
      options: {
        // optional: xslTemplate: `${__dirname}/src/templates/sitemap.xsl`
      },
    },
  ],
};
