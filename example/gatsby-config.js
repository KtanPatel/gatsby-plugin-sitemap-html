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
    siteUrl: `https://www.example.com`,
    title: `Example Gatsby Site`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-sitemap-html`,
      options: {
        // optional: xslTemplate: `${__dirname}/src/templates/sitemap.xsl`
      },
    },
  ],
}
