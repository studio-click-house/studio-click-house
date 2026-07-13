# Publishing Automation Scripts

This directory contains automation scripts for version management and npm publishing.

## 📁 Scripts Overview

### `publish.ps1` - Automated Publishing (Windows)

Comprehensive publishing script that handles all pre-publish checks and npm publishing.

**Usage:**

```powershell
# Full automation with all checks and prompts
.\scripts\publish.ps1

# Skip tests (faster)
.\scripts\publish.ps1 -SkipTests

# Skip security checks
.\scripts\publish.ps1 -SkipSecurity

# Quick publish (no prompts, skip tests)
.\scripts\publish.ps1 -SkipTests -Force

# Nuclear option (skip everything)
.\scripts\publish.ps1 -SkipSecurity -SkipTests -Force
```

**NPM Scripts:**

```bash
# Recommended: Full checks with prompts
npm run publish:auto

# Quick publish (skip tests, no prompts)
npm run publish:quick
```

**What it does:**

1. ✅ Verifies project structure
2. ✅ Checks npm authentication
3. ✅ Runs security audit (npm audit + license check)
4. ✅ Runs package tests
5. ✅ Cleans and rebuilds package
6. ✅ Verifies build output
7. ✅ Validates package content
8. ✅ Displays publishing summary
9. ✅ Publishes to npm with public access
10. ✅ Shows success message with links

---

### `bump-version.js` - Version Management

Automatically bumps package version and creates git tags.

**Usage:**

```bash
# Bump patch version (1.1.4 → 1.1.5)
npm run version:patch

# Bump minor version (1.1.4 → 1.2.0)
npm run version:minor

# Bump major version (1.1.4 → 2.0.0)
npm run version:major
```

**What it does:**

1. ✅ Parses current version from package.json
2. ✅ Calculates new version based on type
3. ✅ Updates package.json
4. ✅ Creates git commit
5. ✅ Creates git tag (e.g., `v1.1.5`)
6. ✅ Displays next steps

---

## 🚀 Complete Publishing Workflow

### Standard Publishing (Recommended)

```bash
# 1. Bump version (choose patch/minor/major)
npm run version:patch

# 2. Publish with all checks
npm run publish:auto
```

### Quick Publishing (for urgent fixes)

```bash
# 1. Bump version
npm run version:patch

# 2. Quick publish (skips tests)
npm run publish:quick
```

### Manual Publishing (direct npm)

```bash
# This will run prepublishOnly hook automatically
# which includes security:all, tests, clean, and build
npm publish --access public
```

---

## 🔒 Security Checks

The publishing script runs comprehensive security checks:

### npm audit

- Scans for known vulnerabilities
- Checks all dependencies
- Fails on moderate+ severity issues

### License Compliance

- Verifies all dependency licenses
- Ensures compatibility with MIT license
- Lists license distribution

### Snyk (optional)

- Deep security analysis
- Requires authentication: `snyk auth`
- Non-blocking (continues if not authenticated)

---

## ⚙️ Configuration

### Skipping Steps

```powershell
# Skip tests (faster, use for documentation-only changes)
.\scripts\publish.ps1 -SkipTests

# Skip security (not recommended, use only if already validated)
.\scripts\publish.ps1 -SkipSecurity

# Skip prompts (automated CI/CD)
.\scripts\publish.ps1 -Force
```

### Environment Variables

None required - script uses current npm authentication.

To login to npm:

```bash
npm login
```

---

## 🛠️ Troubleshooting

### "Not logged in to npm"

```bash
npm login
```

### "Build failed"

```bash
# Clean and rebuild manually
npm run clean
npm run build
```

### "Tests failed"

```bash
# Run tests to see details
npm run test

# Skip tests if they're not critical
npm run publish:quick
```

### "Package already published"

```bash
# Bump version first
npm run version:patch

# Then publish
npm run publish:auto
```

---

## 📝 Files Modified

### `package.json`

- Version number updated by `bump-version.js`
- No manual editing required

### Git

- Automatic commit for version bump
- Automatic tag creation (e.g., `v1.1.5`)
- Push tags separately: `git push --tags`

---

## 🎯 Best Practices

1. **Always bump version before publishing**
   - Use semantic versioning
   - Patch for bug fixes (1.1.4 → 1.1.5)
   - Minor for new features (1.1.4 → 1.2.0)
   - Major for breaking changes (1.1.4 → 2.0.0)

2. **Run full checks for production releases**

   ```bash
   npm run publish:auto
   ```

3. **Use quick publish sparingly**
   - Only for urgent fixes
   - Documentation-only updates
   - When tests are already validated

4. **Review security audit results**
   - Fix vulnerabilities before publishing
   - Run `npm audit fix` if needed

5. **Push git tags after publishing**
   ```bash
   git push --tags
   ```

---

## 📚 Additional Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Snyk Documentation](https://docs.snyk.io/)
