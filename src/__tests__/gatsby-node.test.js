const fs = require('fs-extra');
const path = require('path');
const { onPostBuild } = require('../gatsby-node');

describe('gatsby-plugin-sitemap-html', () => {
  const mockStore = {
    getState: () => ({
      program: { directory: '/mock/root' },
    }),
  };

  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
  const indexXml = `${xmlDeclaration}<sitemapindex><sitemap><loc>http://example.com/sitemap-0.xml</loc></sitemap></sitemapindex>`;
  const urlsetXml = `${xmlDeclaration}<urlset><url><loc>http://example.com/page</loc></url></urlset>`;

  beforeEach(() => {
    fs.pathExistsSync = jest.fn().mockReturnValue(true);
    fs.copy = jest.fn();
    fs.pathExists = jest.fn().mockResolvedValue(false);
    fs.readFile = jest.fn().mockResolvedValue(xmlDeclaration);
    fs.writeFile = jest.fn();
    fs.readdir = jest.fn().mockResolvedValue([]);
    fs.move = jest.fn();
    fs.ensureDir = jest.fn();
  });

  // XSL option tests
  describe('xsl option', () => {
    test('copies XSL template and injects reference by default (xsl: true)', async () => {
      fs.readdir.mockResolvedValue(['sitemap-0.xml']);
      await onPostBuild({ store: mockStore }, {});

      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringMatching(/templates[/\\]sitemap\.xsl/),
        path.join('/mock/root/public', 'sitemap.xsl')
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/mock/root/public', 'sitemap-0.xml'),
        expect.stringContaining(
          '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'
        )
      );
    });

    test('skips XSL copy and injection when xsl: false', async () => {
      fs.readdir.mockResolvedValue(['sitemap-0.xml']);
      await onPostBuild({ store: mockStore }, { xsl: false });

      expect(fs.copy).not.toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/mock/root/public', 'sitemap-0.xml'),
        expect.not.stringContaining('<?xml-stylesheet')
      );
    });

    test('supports custom XSL template path', async () => {
      fs.readdir.mockResolvedValue([]);
      const customPath = '/custom/template.xsl';
      await onPostBuild({ store: mockStore }, { xslTemplate: customPath });

      expect(fs.copy).toHaveBeenCalledWith(
        customPath,
        path.join('/mock/root/public', 'sitemap.xsl')
      );
    });

    test('throws error when default XSL template not found', async () => {
      fs.pathExistsSync = jest.fn().mockReturnValue(false);
      await expect(onPostBuild({ store: mockStore }, {})).rejects.toThrow(
        'gatsby-plugin-sitemap-html: cannot find sitemap.xsl at'
      );
    });

    test('does not throw when xsl: false and template missing', async () => {
      fs.pathExistsSync = jest.fn().mockReturnValue(false);
      fs.readdir.mockResolvedValue([]);
      await expect(
        onPostBuild({ store: mockStore }, { xsl: false })
      ).resolves.not.toThrow();
    });
  });

  // lastmod injection tests
  describe('lastmod injection', () => {
    test('adds lastmod to sitemap index entries without it', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile.mockResolvedValue(indexXml);

      await onPostBuild({ store: mockStore }, {});

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/mock/root/public', 'sitemap-index.xml'),
        expect.stringMatching(/<lastmod>.*<\/lastmod>/)
      );
    });

    test('adds lastmod to URL entries without it', async () => {
      fs.readdir.mockResolvedValue(['sitemap-0.xml']);
      fs.readFile.mockResolvedValue(urlsetXml);

      await onPostBuild({ store: mockStore }, {});

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/mock/root/public', 'sitemap-0.xml'),
        expect.stringMatching(/<lastmod>.*<\/lastmod>/)
      );
    });
  });

  // sitemapFilename tests
  describe('sitemapFilename option', () => {
    test('renames sitemap-index.xml to sitemap.xml by default', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile.mockResolvedValue(xmlDeclaration);

      await onPostBuild({ store: mockStore }, {});

      expect(fs.move).toHaveBeenCalledWith(
        path.join('/mock/root/public', 'sitemap-index.xml'),
        path.join('/mock/root/public', 'sitemap.xml'),
        { overwrite: true }
      );
    });

    test('renames sitemap-index.xml to custom filename', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile.mockResolvedValue(xmlDeclaration);

      await onPostBuild(
        { store: mockStore },
        { sitemapFilename: 'custom-sitemap.xml' }
      );

      expect(fs.move).toHaveBeenCalledWith(
        path.join('/mock/root/public', 'sitemap-index.xml'),
        path.join('/mock/root/public', 'custom-sitemap.xml'),
        { overwrite: true }
      );
    });

    test('keeps original filename when sitemapFilename is sitemap-index.xml', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile.mockResolvedValue(xmlDeclaration);

      await onPostBuild(
        { store: mockStore },
        { sitemapFilename: 'sitemap-index.xml' }
      );

      expect(fs.move).toHaveBeenCalledWith(
        path.join('/mock/root/public', 'sitemap-index.xml'),
        path.join('/mock/root/public', 'sitemap-index.xml'),
        { overwrite: true }
      );
    });
  });

  // htmlSitemap option tests
  describe('htmlSitemap option', () => {
    const indexWithChild = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex><sitemap><loc>http://example.com/sitemap-0.xml</loc><lastmod>2025-01-01T00:00:00.000Z</lastmod></sitemap></sitemapindex>`;
    const childContent = `<?xml version="1.0" encoding="UTF-8"?><urlset><url><loc>http://example.com/page</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2025-01-01T00:00:00.000Z</lastmod></url></urlset>`;

    test('does not generate HTML sitemap by default', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile.mockResolvedValue(indexWithChild);

      await onPostBuild({ store: mockStore }, {});

      expect(fs.ensureDir).not.toHaveBeenCalled();
    });

    test('generates HTML sitemap at default path when htmlSitemap: true', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml', 'sitemap-0.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile
        .mockResolvedValueOnce(indexWithChild) // sitemap-index.xml
        .mockResolvedValueOnce(childContent) // sitemap-0.xml
        .mockResolvedValueOnce(indexWithChild); // re-read after move

      await onPostBuild({ store: mockStore }, { htmlSitemap: true });

      expect(fs.ensureDir).toHaveBeenCalledWith(
        path.join('/mock/root/public', '/sitemap')
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/mock/root/public', '/sitemap', 'index.html'),
        expect.stringContaining('<!DOCTYPE html>')
      );
    });

    test('generates HTML sitemap at custom path when htmlSitemapPath is set', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml', 'sitemap-0.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile
        .mockResolvedValueOnce(indexWithChild)
        .mockResolvedValueOnce(childContent)
        .mockResolvedValueOnce(indexWithChild);

      await onPostBuild(
        { store: mockStore },
        { htmlSitemap: true, htmlSitemapPath: '/my-sitemap' }
      );

      expect(fs.ensureDir).toHaveBeenCalledWith(
        path.join('/mock/root/public', '/my-sitemap')
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/mock/root/public', '/my-sitemap', 'index.html'),
        expect.stringContaining('<!DOCTYPE html>')
      );
    });

    test('HTML sitemap contains sitemap entry and URL data', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml', 'sitemap-0.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile
        .mockResolvedValueOnce(indexWithChild)
        .mockResolvedValueOnce(childContent)
        .mockResolvedValueOnce(indexWithChild);

      await onPostBuild({ store: mockStore }, { htmlSitemap: true });

      const htmlCall = fs.writeFile.mock.calls.find(([p]) =>
        p.endsWith('index.html')
      );
      expect(htmlCall[1]).toContain('sitemap-0.xml');
      expect(htmlCall[1]).toContain('http://example.com/page');
      expect(htmlCall[1]).toContain('2025-01-01');
    });

    test('HTML sitemap uses custom sitemapFilename in link', async () => {
      fs.readdir.mockResolvedValue(['sitemap-index.xml', 'sitemap-0.xml']);
      fs.pathExists.mockResolvedValue(true);
      fs.readFile
        .mockResolvedValueOnce(indexWithChild)
        .mockResolvedValueOnce(childContent)
        .mockResolvedValueOnce(indexWithChild);

      await onPostBuild(
        { store: mockStore },
        { htmlSitemap: true, sitemapFilename: 'custom-sitemap.xml' }
      );

      const htmlCall = fs.writeFile.mock.calls.find(([p]) =>
        p.endsWith('index.html')
      );
      expect(htmlCall[1]).toContain('custom-sitemap.xml');
    });
  });
});
