# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please do the following:

1. **Do not** open a public issue
2. Email the maintainer at: [Create a private security advisory](https://github.com/KtanPatel/gatsby-plugin-sitemap-html/security/advisories/new)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Release**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next regular release

## Security Best Practices

When using this plugin:

1. Keep the plugin updated to the latest version
2. Review the CHANGELOG for security-related updates
3. Use the built-in XSL template unless you need customization
4. If using a custom XSL template, ensure it doesn't execute untrusted code
5. Validate that your sitemap doesn't expose sensitive URLs

## Disclosure Policy

When a security issue is fixed:

1. A security advisory will be published
2. The fix will be released in a new version
3. Credit will be given to the reporter (unless they prefer to remain anonymous)

## Known Security Considerations

- This plugin processes XML files and applies XSL transformations
- Custom XSL templates should be reviewed for security implications
- The plugin does not execute user-provided code at runtime
- All file operations are performed during the build process

## Contact

For security concerns, please use GitHub's security advisory feature or contact the maintainer directly.
