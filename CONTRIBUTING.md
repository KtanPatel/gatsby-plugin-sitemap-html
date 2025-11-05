# Contributing

Thanks for your interest in contributing to gatsby-plugin-sitemap-html!

## Development Setup

```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm run build

# Run tests
pnpm test
```

## Project Structure

```
├── src/
│   ├── gatsby-node.js       # Source code
│   ├── templates/           # XSL template
│   └── __tests__/           # Tests
├── example/                 # Example Gatsby site
├── scripts/                 # Build and release scripts
└── gatsby-node.js           # Built file (git-ignored)
```

## Making Changes

1. Edit source files in `src/`
2. Run `pnpm run build` to transpile to root
3. Run `pnpm test` to verify tests pass
4. Test with the example: `cd example && pnpm install && pnpm build && pnpm serve`

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure CI passes
5. Submit a pull request

## Release Process

Releases are handled by maintainers using `node scripts/release-local.js`.
