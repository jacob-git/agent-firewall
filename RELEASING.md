# Releasing

## First Release Checklist

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

4. Authenticate with npm.

```bash
npm login
```

5. Publish the package.

```bash
npm publish --access public
```

6. Tag the release in git.

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Notes

- `prepublishOnly` already runs build and test before publish.
- The package is configured to publish only `dist`, `README.md`, and `LICENSE`.
- If the first version needs a final metadata adjustment, update `package.json` before publishing.
