# CI/CD Documentation

This document describes the continuous integration and deployment setup for this project.

## Workflows

### 1. CI (Continuous Integration)

**File:** `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**
- Format checking (Prettier)
- Linting (ESLint)
- Tests (Jest)
- Example build
- Runs on Node 18.x and 20.x

**Purpose:** Ensures code quality and functionality before merging.

### 2. Code Coverage

**File:** `.github/workflows/coverage.yml`

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**
- Run tests with coverage
- Upload coverage to Codecov

**Purpose:** Tracks test coverage and displays badge in README.

**Setup Required:**
1. Sign up at [Codecov.io](https://codecov.io)
2. Add repository
3. Add `CODECOV_TOKEN` to GitHub secrets (optional for public repos)

### 3. Publish to npm

**File:** `.github/workflows/publish.yml`

**Triggers:**
- Push tags matching `v*` (e.g., `v1.2.0`)

**Jobs:**
- Install dependencies
- Build package
- Run tests
- Publish to npm with provenance

**Purpose:** Automates npm publishing when a version tag is pushed.

**Setup Required:**
1. Create npm account
2. Generate npm token (Automation type)
3. Add `NPM_TOKEN` to GitHub secrets

**Usage:**
```bash
git tag v1.2.0
git push origin v1.2.0
```

### 4. Create Release

**File:** `.github/workflows/release.yml`

**Triggers:**
- Push tags matching `v*`

**Jobs:**
- Extract changelog for version
- Create GitHub release with notes

**Purpose:** Automatically creates GitHub releases with changelog.

**Requirements:**
- Changelog must follow Keep a Changelog format
- Version must exist in CHANGELOG.md

### 5. Label PRs

**File:** `.github/workflows/label-pr.yml`

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**
- Automatically label PRs based on changed files

**Labels:**
- `documentation` - Changes to docs or markdown files
- `dependencies` - Changes to package.json
- `tests` - Changes to test files
- `ci` - Changes to GitHub workflows
- `source` - Changes to source code

**Configuration:** `.github/labeler.yml`

## Dependabot

**File:** `.github/dependabot.yml`

**Configuration:**
- Weekly updates on Mondays
- Separate updates for npm and GitHub Actions
- Groups related dependencies (Babel, ESLint)
- Auto-labels PRs as `dependencies` and `automated`

**Purpose:** Keeps dependencies up to date automatically.

## Secrets Required

Add these secrets in GitHub repository settings:

### NPM_TOKEN
1. Go to [npmjs.com](https://www.npmjs.com)
2. Account Settings → Access Tokens
3. Generate New Token → Automation
4. Copy token
5. GitHub repo → Settings → Secrets → New repository secret
6. Name: `NPM_TOKEN`, Value: (paste token)

### CODECOV_TOKEN (Optional for public repos)
1. Go to [codecov.io](https://codecov.io)
2. Add repository
3. Copy upload token
4. GitHub repo → Settings → Secrets → New repository secret
5. Name: `CODECOV_TOKEN`, Value: (paste token)

## Release Process

### Automated (Recommended)

1. Update version in `package.json`
2. Update `CHANGELOG.md` with new version
3. Commit changes
4. Create and push tag:
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```
5. Workflows automatically:
   - Create GitHub release
   - Publish to npm
   - Generate release notes

### Manual

Use the release script:
```bash
node scripts/release-local.js
```

## Coverage Thresholds

**File:** `jest.config.js`

Current thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

Tests will fail if coverage drops below these thresholds.

## Monitoring

### GitHub Actions
- View workflow runs: Repository → Actions tab
- Check status badges in README

### npm
- View package: https://www.npmjs.com/package/gatsby-plugin-sitemap-html
- Check download stats

### Codecov
- View coverage: https://codecov.io/gh/KtanPatel/gatsby-plugin-sitemap-html
- Track coverage trends

## Troubleshooting

### Publish workflow fails

**Error:** `npm ERR! 403 Forbidden`
- Check NPM_TOKEN is valid
- Ensure token has publish permissions
- Verify package name is available

### Coverage upload fails

**Error:** `Codecov token not found`
- Add CODECOV_TOKEN to secrets (or make repo public)
- Check token is valid

### Release creation fails

**Error:** `Version not found in CHANGELOG`
- Ensure version exists in CHANGELOG.md
- Check format: `## [1.2.0] - YYYY-MM-DD`

### Dependabot PRs failing

- Check if CI passes on main branch
- Review dependency changes for breaking changes
- May need to update code for new dependency versions

## Best Practices

1. **Always run tests locally** before pushing
2. **Update CHANGELOG.md** before creating releases
3. **Use semantic versioning** for tags
4. **Review Dependabot PRs** before merging
5. **Monitor coverage trends** to maintain quality
6. **Keep workflows updated** with latest action versions

## Workflow Diagram

```
Push to main
    ↓
CI Workflow (format, lint, test)
    ↓
Coverage Workflow (upload to Codecov)

Push tag v*
    ↓
Release Workflow (create GitHub release)
    ↓
Publish Workflow (publish to npm)

Pull Request
    ↓
Label Workflow (auto-label)
    ↓
CI Workflow (validate changes)
```
