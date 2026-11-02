/**
 * gatsby-plugin-sitemap-html
 * Copyright (c) 2025 Ketan Patel
 * MIT License
 */

const fs = require('fs-extra');
const path = require('path');

const XSL_STYLESHEET = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

function formatDate(isoString) {
  if (!isoString) return 'N/A';
  return isoString.substring(0, 10) + ' ' + isoString.substring(11, 16);
}

function parseXmlEntries(content, tag) {
  const entries = [];
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'g');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const block = match[1];
    const get = (t) => {
      const m = block.match(new RegExp(`<${t}>([^<]*)<\\/${t}>`));
      return m ? m[1].trim() : '';
    };
    entries.push({
      loc: get('loc'),
      lastmod: get('lastmod'),
      changefreq: get('changefreq'),
      priority: get('priority'),
    });
  }
  return entries;
}

function generateHtmlSitemap(indexEntries, childSitemaps, sitemapFilename) {
  const CSS = `
    *,*::before,*::after{box-sizing:border-box}
    body{font-family:sans-serif;font-size:16px;color:#242628;margin:0}
    a{color:#000}
    #content{margin:0 auto;padding:2% 5%;max-width:800px}
    h1{margin-bottom:4px}
    .meta{font-size:12px;color:#666;margin-bottom:24px}
    .sitemap-group{margin-bottom:8px;border:1px solid #ddd;border-radius:4px;overflow:hidden}
    .sitemap-group input[type="checkbox"]{display:none}
    .sitemap-group label{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f5f5f5;cursor:pointer;font-size:13px;font-weight:bold;user-select:none}
    .sitemap-group label:hover{background:#e2edf2}
    .sitemap-group label .arrow{transition:transform 0.2s;display:inline-block}
    .sitemap-group input[type="checkbox"]:checked ~ label .arrow{transform:rotate(90deg)}
    .sitemap-group .urls{display:none;overflow:auto}
    .sitemap-group input[type="checkbox"]:checked ~ .urls{display:block}
    table{border-collapse:collapse;width:100%}
    th{text-align:left;padding:6px 8px;font-size:11px;border-bottom:1px solid #7d878a;background:#fafafa}
    td{font-size:11px;padding:5px 8px}
    tr:nth-child(odd) td{background-color:rgba(0,0,0,0.04)}
    tr:hover td{background-color:#e2edf2}
    .badge{display:inline-block;background:#e0e0e0;border-radius:10px;padding:1px 8px;font-size:11px;margin-left:8px;font-weight:normal}
  `;

  const groupsHtml = indexEntries
    .map((entry, i) => {
      const child = childSitemaps[entry.loc] || [];
      const id = `sm-${i}`;
      const label = entry.loc.split('/').pop() || entry.loc;
      const lastmod = formatDate(entry.lastmod);

      const rowsHtml = child
        .map(
          (url) => `
          <tr>
            <td><a href="${url.loc}">${url.loc}</a></td>
            <td>${url.changefreq || 'N/A'}</td>
            <td>${url.priority || 'N/A'}</td>
            <td>${formatDate(url.lastmod)}</td>
          </tr>`
        )
        .join('');

      return `
        <div class="sitemap-group">
          <input type="checkbox" id="${id}">
          <label for="${id}">
            <span>${label} <span class="badge">${child.length} URLs</span></span>
            <span style="display:flex;gap:16px;font-weight:normal">
              <span>Last Modified: ${lastmod}</span>
              <span class="arrow">&#9654;</span>
            </span>
          </label>
          <div class="urls">
            <table cellpadding="3">
              <thead>
                <tr>
                  <th width="55%">URL</th>
                  <th width="15%">Change Freq</th>
                  <th width="10%">Priority</th>
                  <th width="20%">Last Modified</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>XML Sitemap</title>
  <style>${CSS}</style>
</head>
<body>
  <div id="content">
    <h1>XML Sitemap</h1>
    <p class="meta">${indexEntries.length} sitemap(s) &mdash; <a href="/${sitemapFilename}">${sitemapFilename}</a></p>
    ${groupsHtml}
  </div>
</body>
</html>`;
}

exports.onPostBuild = async ({ store }, pluginOptions) => {
  const { program } = store.getState();
  const output = pluginOptions.output || '/';
  const publicDir = program.directory
    ? path.join(program.directory, 'public', output)
    : path.join('public', output);

  const xsl = pluginOptions.xsl !== false;
  const htmlSitemap = pluginOptions.htmlSitemap === true;
  const htmlSitemapPath = pluginOptions.htmlSitemapPath || '/sitemap';
  const sitemapFilename = pluginOptions.sitemapFilename || 'sitemap.xml';

  // Handle XSL
  if (xsl) {
    let xslTemplate = pluginOptions.xslTemplate;
    if (!xslTemplate) {
      xslTemplate = path.join(__dirname, 'templates', 'sitemap.xsl');
      if (!fs.pathExistsSync(xslTemplate)) {
        throw new Error(
          `gatsby-plugin-sitemap-html: cannot find sitemap.xsl at ${xslTemplate}`
        );
      }
    }
    await fs.copy(xslTemplate, path.join(publicDir, 'sitemap.xsl'));
  }

  // Process sitemap XML files
  const sitemapFiles = (await fs.readdir(publicDir)).filter(
    (f) => f === 'sitemap-index.xml' || /^sitemap-\d+\.xml$/.test(f)
  );

  const timestamp = new Date().toISOString();
  const childSitemapContents = {};

  for (const file of sitemapFiles) {
    const filePath = path.join(publicDir, file);
    let content = await fs.readFile(filePath, 'utf8');

    // Inject XSL reference only if xsl option is enabled
    if (xsl && !content.includes('<?xml-stylesheet')) {
      content = content.replace(
        XML_DECLARATION,
        `${XML_DECLARATION}\n${XSL_STYLESHEET}`
      );
    }

    // Add lastmod to sitemap index entries without it
    if (content.includes('<sitemapindex')) {
      content = content.replace(
        /<sitemap>(?![\s\S]*?<lastmod>)([\s\S]*?)<\/sitemap>/g,
        `<sitemap>$1<lastmod>${timestamp}</lastmod></sitemap>`
      );
    }

    // Add lastmod to URL entries without it
    if (content.includes('<urlset')) {
      content = content.replace(
        /<url>(?![\s\S]*?<lastmod>)([\s\S]*?)<\/url>/g,
        `<url>$1<lastmod>${timestamp}</lastmod></url>`
      );
      childSitemapContents[file] = content;
    }

    await fs.writeFile(filePath, content);
  }

  // Rename sitemap-index.xml to configured filename
  const sitemapIndexPath = path.join(publicDir, 'sitemap-index.xml');
  const sitemapPath = path.join(publicDir, sitemapFilename);
  let indexContent = null;
  if (await fs.pathExists(sitemapIndexPath)) {
    indexContent = await fs.readFile(sitemapIndexPath, 'utf8');
    await fs.move(sitemapIndexPath, sitemapPath, { overwrite: true });
  } else if (await fs.pathExists(sitemapPath)) {
    indexContent = await fs.readFile(sitemapPath, 'utf8');
  }

  // Generate HTML sitemap
  if (htmlSitemap && indexContent) {
    const indexEntries = parseXmlEntries(indexContent, 'sitemap');

    // Build map of loc -> parsed URL entries
    const childSitemaps = {};
    for (const entry of indexEntries) {
      const filename = entry.loc.split('/').pop();
      const content = childSitemapContents[filename];
      if (content) {
        childSitemaps[entry.loc] = parseXmlEntries(content, 'url');
      }
    }

    const html = generateHtmlSitemap(indexEntries, childSitemaps, sitemapFilename);
    const rootDir = program.directory
      ? path.join(program.directory, 'public')
      : 'public';
    const htmlDir = path.join(rootDir, htmlSitemapPath);
    await fs.ensureDir(htmlDir);
    await fs.writeFile(path.join(htmlDir, 'index.html'), html);
  }
};
