# Releasing

## Trusted Publishing Setup

Trusted Publishing removes the need for a long-lived npm publish token by allowing npm to trust a specific GitHub Actions workflow through OIDC.

For this repository, configure npm trusted publishing with:

- Organization or user: `jacob-git`
- Repository: `agent-firewall`
- Workflow filename: `publish.yml`
- Environment name: leave empty unless you later add a protected GitHub environment

The workflow file already exists at:

```text
.github/workflows/publish.yml
```

## npm Configuration Steps

1. Open the package settings for `@pallattu/agent-firewall` on npmjs.com.
2. Go to the Trusted publishing section.
3. Add a GitHub Actions trusted publisher with the values above.
4. Save the configuration.
5. After the first successful trusted publish, consider restricting token-based publishing for the package.

## Release Flow

### Option 1: Publish by tag

1. Confirm local state is clean.

```bash
git status
```

2. Create and push a release tag.

```bash
git tag v0.1.0
git push origin v0.1.0
```

The GitHub Actions workflow will build, test, and publish automatically.

### Option 2: Manual workflow dispatch

Run the `Publish Package` workflow manually from the GitHub Actions UI.

## Local Validation Checklist

1. Confirm local state is clean.

```bash
git status
```

2. Build and test.

```bash
npm run build
npm test
```

3. Inspect the package tarball.

```bash
npm pack
tar -tzf agent-firewall-0.1.0.tgz
rm agent-firewall-0.1.0.tgz
```

4. If you are still doing a local one-off publish, authenticate with npm and publish manually.

## Notes

- Trusted publishing requires the workflow filename on npmjs.com to match `publish.yml` exactly.
- Trusted publishing for npm requires GitHub-hosted runners.
- `prepublishOnly` already runs build and test before publish.
- The package is configured to publish only `dist`, `README.md`, and `LICENSE`.
- If you later add private dependencies, install them in the workflow with a separate read-only npm token. Trusted publishing only replaces publish authentication.
