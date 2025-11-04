module.exports = {
  siteMetadata: {
    siteUrl: "https://www.example.com",
    title: "Example Gatsby Site",
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    // Transpile certain node_modules that ship ESM TypeScript (.mts/.cts) or
    // untranspiled code so Gatsby's query extractor can process them.
    {
      resolve: `gatsby-plugin-compile-es6-packages`,
      options: {
        modules: [
          `@graphql-codegen`,
          `graphql-http`,
          `@graphql-tools`,
          `@graphql-codegen/*`
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sitemap-html`,
      options: {
        // Using default XSL template
      },
    },
  ],
};
