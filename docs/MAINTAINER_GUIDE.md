# Maintainer Guide

Quick reference for maintaining this package.

## Initial Setup

### 1. GitHub Secrets

Add these in repository Settings → Secrets and variables → Actions:

```
NPM_TOKEN          - npm automation token
CODECOV_TOKEN      - Codecov upload token (optional for public repos)
```

### 2. Enable Workflows

Ensure GitHub Actions are enabled in repository settings.

### 3. Codecov Integration

1. Visit https://codecov.io
2. Sign in with GitHub
3. Add repository
4. Copy token (if private repo)

## Release Checklist

### Before Release

- [ ] All tests passing locally
- [ ] Code formatted and linted
- [ ] Documentation updated
- [ ] CHANGELOG.md updated with new version
- [ ] Version bumped in package.json

### Release Steps

```bash
# 1. Update version
npm version patch|minor|major

# 2. Update CHANGELOG.md
# Add entry for new version with date

# 3. Commit changes
git add .
git commit -m "chore(release): v1.2.0"

# 4. Create and push tag
git tag v1.2.0
git push origin main --follow-tags

# 5. Workflows will automatically:
#    - Create GitHub release
#    - Publish to npm
```

### Alternative: Use Release Script

```bash
node scripts/release-local.js
```

Follow prompts for automated release.

## Reviewing PRs

### Automated Checks

Wait for these to pass:
- ✅ Format check
- ✅ Lint check
- ✅ Tests
- ✅ Coverage

### Manual Review

- [ ] Code quality
- [ ] Tests included
- [ ] Documentation updated
- [ ] Breaking changes noted
- [ ] CHANGELOG.md updated (if needed)

### Dependabot PRs

1. Check CI passes
2. Review changelog of dependency
3. Test locally if major version bump
4. Merge if safe

## Monitoring

### Weekly Tasks

- [ ] Review open issues
- [ ] Review open PRs
- [ ] Check Dependabot PRs
- [ ] Monitor npm download stats

### Monthly Tasks

- [ ] Review coverage trends
- [ ] Update dependencies manually if needed
- [ ] Check for security advisories
- [ ] Review and close stale issues

## Common Tasks

### Update Dependencies

```bash
pnpm update
pnpm test
git commit -am "chore: update dependencies"
```

### Fix Failing CI

```bash
# Format code
pnpm run format

# Fix linting
pnpm run lint:fix

# Run tests
pnpm test
```

### Unpublish Version (Emergency)

```bash
npm unpublish gatsby-plugin-sitemap-html@1.2.0
```

⚠️ Only within 72 hours of publish

### Deprecate Version

```bash
npm deprecate gatsby-plugin-sitemap-html@1.2.0 "Reason for deprecation"
```

## Troubleshooting

### CI Failing on Main

1. Check workflow logs
2. Run locally: `pnpm run format:check && pnpm run lint && pnpm test`
3. Fix issues and push

### npm Publish Failed

1. Check NPM_TOKEN is valid
2. Verify version doesn't already exist
3. Check npm status: https://status.npmjs.org

### Coverage Dropped

1. Review recent changes
2. Add missing tests
3. Update coverage thresholds if intentional

## Security

### Reporting Vulnerabilities

Direct users to SECURITY.md for reporting.

### Handling Reports

1. Acknowledge within 48 hours
2. Assess severity
3. Create private fix
4. Coordinate disclosure
5. Release patch
6. Publish security advisory

## Communication

### Issue Responses

- Respond within 48 hours
- Be friendly and helpful
- Ask for reproduction steps
- Label appropriately

### PR Feedback

- Review within 1 week
- Provide constructive feedback
- Suggest improvements
- Thank contributors

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
