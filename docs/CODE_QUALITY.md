# Code Quality Tools

This project uses several tools to maintain code quality and consistency.

## Tools

### ESLint

Lints JavaScript code to catch errors and enforce coding standards.

**Run linting:**
```bash
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint:fix
```

**Configuration:** `.eslintrc.js`

### Prettier

Formats code consistently across the project.

**Format code:**
```bash
npm run format
```

**Check formatting:**
```bash
npm run format:check
```

**Configuration:** `.prettierrc.js`

### Husky

Git hooks to enforce quality checks before commits and pushes.

**Hooks:**
- `pre-commit`: Runs lint-staged (formats and lints staged files)
- `pre-push`: Runs tests

**Setup:**
```bash
npm install  # Husky installs automatically via prepare script
```

### lint-staged

Runs linters on staged files only, making commits faster.

**Configuration:** `package.json` (lint-staged section)

### Jest

Testing framework with coverage reporting.

**Run tests:**
```bash
npm test
```

**Run with coverage:**
```bash
npm run test:coverage
```

## CI Integration

All quality checks run automatically in CI:
1. Format check
2. Lint check
3. Tests
4. Example build

See `.github/workflows/ci.yml` for details.

## Editor Integration

### VS Code

Install these extensions:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm / IntelliJ

1. Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable Prettier: Settings → Languages & Frameworks → JavaScript → Prettier
3. Check "On save" for both

## Bypassing Hooks

**Skip pre-commit (not recommended):**
```bash
git commit --no-verify
```

**Skip pre-push (not recommended):**
```bash
git push --no-verify
```

## Troubleshooting

### Husky hooks not running

```bash
# Reinstall husky
rm -rf .husky
npm run prepare
```

### ESLint errors after pull

```bash
# Reinstall dependencies
npm install
```

### Prettier conflicts with ESLint

The project uses `eslint-config-prettier` to disable conflicting ESLint rules. If you see conflicts, ensure your ESLint config extends 'prettier'.
