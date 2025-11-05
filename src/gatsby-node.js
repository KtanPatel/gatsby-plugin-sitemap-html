/**
 * gatsby-plugin-sitemap-html
 * Copyright (c) 2025 Ketan Patel
 * MIT License
 */

const fs = require('fs-extra');
const path = require('path');

exports.onPostBuild = async ({ store }, pluginOptions) => {
  const { program } = store.getState();
  const output = pluginOptions.output || '/';
  const publicDir = program.directory
    ? path.join(program.directory, 'public', output)
    : path.join('public', output);
  let xslTemplate = pluginOptions.xslTemplate;
  if (!xslTemplate) {
    // prefer bundled templates/ path, but fall back to src/templates/ for local/dev installs
    const candidates = [
      path.join(__dirname, 'templates', 'sitemap.xsl'),
      path.join(__dirname, 'src', 'templates', 'sitemap.xsl'),
    ];
    xslTemplate = candidates.find((p) => fs.pathExistsSync(p));
    if (!xslTemplate) {
      throw new Error(
        `gatsby-plugin-sitemap-html: cannot find sitemap.xsl in package. Searched: ${candidates.join(', ')}`
      );
    }
  }

  // Copy XSL template to public directory
  await fs.copy(xslTemplate, path.join(publicDir, 'sitemap.xsl'));

  // Inject XSL reference into all sitemap files
  const sitemapFiles = (await fs.readdir(publicDir)).filter(
    (f) => f === 'sitemap-index.xml' || /^sitemap-\d+\.xml$/.test(f)
  );

  for (const file of sitemapFiles) {
    const filePath = path.join(publicDir, file);
    let content = await fs.readFile(filePath, 'utf8');
    if (!content.includes('<?xml-stylesheet')) {
      content = content.replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'
      );
      await fs.writeFile(filePath, content);
    }
  }

  // Rename sitemap-index.xml to sitemap.xml
  const sitemapIndexPath = path.join(publicDir, 'sitemap-index.xml');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  if (await fs.pathExists(sitemapIndexPath)) {
    await fs.move(sitemapIndexPath, sitemapPath, { overwrite: true });
  }
};
