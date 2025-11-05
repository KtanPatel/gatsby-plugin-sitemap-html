const fs = require("fs-extra");
const path = require("path");
const {
  onPostBuild
} = require("../gatsby-node");
describe("gatsby-plugin-sitemap-html", () => {
  const mockStore = {
    getState: () => ({
      program: {
        directory: "/mock/root"
      }
    })
  };
  beforeEach(() => {
    fs.existsSync = jest.fn();
    fs.copy = jest.fn();
    fs.pathExists = jest.fn();
    fs.readFile = jest.fn();
    fs.writeFile = jest.fn();
    fs.readdir = jest.fn().mockResolvedValue([]);
    fs.move = jest.fn();
  });
  test("copies XSL template to public directory", async () => {
    fs.readdir.mockResolvedValue([]);
    await onPostBuild({
      store: mockStore
    }, {});
    expect(fs.copy).toHaveBeenCalledWith(expect.stringMatching(/templates[\/\\]sitemap\.xsl/), path.join("/mock/root/public", "sitemap.xsl"));
  });
  test("injects XSL reference into sitemap files and renames index", async () => {
    fs.readdir.mockResolvedValue(["sitemap-index.xml", "sitemap-0.xml"]);
    fs.pathExists.mockResolvedValue(true);
    fs.readFile.mockResolvedValue('<?xml version="1.0" encoding="UTF-8"?>');
    await onPostBuild({
      store: mockStore
    }, {});
    expect(fs.writeFile).toHaveBeenCalledWith(path.join("/mock/root/public", "sitemap-index.xml"), expect.stringContaining('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'));
    expect(fs.move).toHaveBeenCalledWith(path.join("/mock/root/public", "sitemap-index.xml"), path.join("/mock/root/public", "sitemap.xml"), {
      overwrite: true
    });
  });
  test("supports custom XSL template path", async () => {
    fs.readdir.mockResolvedValue([]);
    const customPath = "/custom/template.xsl";
    await onPostBuild({
      store: mockStore
    }, {
      xslTemplate: customPath
    });
    expect(fs.copy).toHaveBeenCalledWith(customPath, path.join("/mock/root/public", "sitemap.xsl"));
  });
});