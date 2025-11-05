# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-04

### Added

- Initial release
- Support for HTML-styled sitemaps using XSL
- Custom XSL template support via options
- Integration with gatsby-plugin-sitemap
- Automated XSL injection into sitemap.xml
- Full test coverage
- Example site demonstrating usage

## [1.0.1] - 2025-11-05

### Fixed

- Fix ENOENT in onPostBuild when installed via pnpm or using a local `file:..` dependency: plugin now searches both `templates/sitemap.xsl` and `src/templates/sitemap.xsl` and copies the available template into the site's `public/` directory. This prevents build failures in environments where the package layout differs (pnpm, local installs).

### CI

- Use pnpm in CI and cache the pnpm store to speed up installs.
