module.exports = {
  siteMetadata: {
    siteUrl: "https://www.example.com",
    title: "Example Gatsby Site",
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-sitemap-html`,
      options: {
        // Using default XSL template
      },
    },
  ],
};
