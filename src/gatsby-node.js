/**
 * gatsby-plugin-sitemap-html
 * Copyright (c) 2025 Ketan Patel
 * MIT License
 */

const fs = require("fs-extra");
const path = require("path");

exports.onPostBuild = async ({ store }, pluginOptions) => {
  const { program } = store.getState();
  const publicDir = program.directory
    ? path.join(program.directory, "public")
    : "public";
  let xslTemplate = pluginOptions.xslTemplate;
  if (!xslTemplate) {
    // prefer bundled templates/ path, but fall back to src/templates/ for local/dev installs
    const candidates = [
      path.join(__dirname, "templates", "sitemap.xsl"),
      path.join(__dirname, "src", "templates", "sitemap.xsl"),
    ];
    xslTemplate = candidates.find((p) => fs.pathExistsSync(p));
    if (!xslTemplate) {
      throw new Error(
        `gatsby-plugin-sitemap-html: cannot find sitemap.xsl in package. Searched: ${candidates.join(
          ", "
        )}`
      );
    }
  }

  // Copy XSL template to public directory
  await fs.copy(xslTemplate, path.join(publicDir, "sitemap.xsl"));

  // Read sitemap.xml and inject XSL reference
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  if (await fs.pathExists(sitemapPath)) {
    let sitemapContent = await fs.readFile(sitemapPath, "utf8");
    if (!sitemapContent.includes("<?xml-stylesheet")) {
      sitemapContent = sitemapContent.replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'
      );
      await fs.writeFile(sitemapPath, sitemapContent);
    }
  }
};
