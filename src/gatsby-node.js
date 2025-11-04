const fs = require("fs-extra");
const path = require("path");

exports.onPostBuild = async ({ store }, pluginOptions) => {
  const { program } = store.getState();
  const publicDir = program.directory
    ? path.join(program.directory, "public")
    : "public";
  const xslTemplate =
    pluginOptions.xslTemplate || path.join(__dirname, "templates/sitemap.xsl");

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
