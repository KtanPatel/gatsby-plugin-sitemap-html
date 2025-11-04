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
  });
  test("copies XSL template to public directory", async () => {
    await onPostBuild({
      store: mockStore
    }, {});
  expect(fs.copy).toHaveBeenCalledWith(expect.stringMatching(/templates[\/\\]sitemap\.xsl/), path.join("/mock/root/public", "sitemap.xsl"));
  });
  test("injects XSL reference into sitemap.xml", async () => {
    fs.pathExists.mockResolvedValue(true);
    fs.readFile.mockResolvedValue('<?xml version="1.0" encoding="UTF-8"?>');
    await onPostBuild({
      store: mockStore
    }, {});
    expect(fs.writeFile).toHaveBeenCalledWith(path.join("/mock/root/public", "sitemap.xml"), expect.stringContaining('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'));
  });
  test("supports custom XSL template path", async () => {
    const customPath = "/custom/template.xsl";
    await onPostBuild({
      store: mockStore
    }, {
      xslTemplate: customPath
    });
    expect(fs.copy).toHaveBeenCalledWith(customPath, path.join("/mock/root/public", "sitemap.xsl"));
  });
});