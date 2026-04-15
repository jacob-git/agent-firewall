# Releasing

## GitHub Actions Publish Setup

This repository is configured to publish through GitHub Actions using an npm token stored as a repository secret.

The workflow file is:

```text
.github/workflows/publish.yml
```

## GitHub Configuration Steps

1. Open the `agent-firewall` repository on GitHub.
2. Go to `Settings` -> `Secrets and variables` -> `Actions`.
3. Add a new repository secret named `NPM_TOKEN`.
4. Use an npm token that can publish `@pallattu/agent-firewall`.

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

- GitHub Actions publishing requires the `NPM_TOKEN` secret to exist in the repository.
- `prepublishOnly` already runs build and test before publish.
- The package is configured to publish only `dist`, `README.md`, and `LICENSE`.
- If you later add private dependencies, install them in the workflow with a separate read-only npm token. `NPM_TOKEN` should remain dedicated to publishing.
