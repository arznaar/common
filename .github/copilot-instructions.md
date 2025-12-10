# GitHub Copilot Instructions

## PR Review and Labeling

When reviewing pull requests, always ensure the following labels are considered and added as appropriate:

### Required Labels for Version Management

- **`feature`**: Add this label if the PR introduces a new feature, capability, or enhancement that adds functionality to the codebase.
  - Examples: New API endpoints, new components, new utilities, new configuration options
  - This will trigger a **minor version bump** (e.g., v1.2.3 → v1.3.0)

- **`breaking change`**: Add this label if the PR introduces backward-incompatible changes that would require users to modify their code.
  - Examples: Removing or renaming public APIs, changing function signatures, modifying behavior that breaks existing usage patterns, updating peer dependencies with breaking changes
  - This will trigger a **major version bump** (e.g., v1.2.3 → v2.0.0)

### Default Behavior

- If neither `feature` nor `breaking change` labels are present, the PR will trigger a **patch version bump** (e.g., v1.2.3 → v1.2.4)
- This is appropriate for bug fixes, documentation updates, refactoring, and other non-feature changes

### Label Application Guidelines

1. **During PR Review**: Check if the PR introduces new functionality or breaks backward compatibility
2. **Be Conservative**: When in doubt, prefer lower-impact labels (patch over minor, minor over major)
3. **Multiple Changes**: If a PR contains both features and breaking changes, use the `breaking change` label (highest impact wins)
4. **Communicate**: When adding these labels, leave a comment explaining the reasoning to help maintainers and future reviewers

### Examples

**Feature Label:**
```
✓ Adding a new utility function to the library
✓ Implementing a new configuration option
✓ Adding support for a new data format
```

**Breaking Change Label:**
```
✓ Removing a deprecated API
✓ Changing the signature of a public function
✓ Renaming exported classes or modules
✓ Updating to a new major version of a peer dependency
```

**No Special Label (Patch):**
```
✓ Fixing a bug in existing functionality
✓ Updating documentation
✓ Refactoring internal code without changing public API
✓ Performance improvements that don't change behavior
✓ Updating dev dependencies
```

## Automated Version Tagging

This repository uses automated semantic versioning based on PR labels. When PRs are merged to the default branch, the publish workflow will:

1. Collect all PRs merged since the last release tag
2. Analyze their labels to determine the version bump type
3. Create and push an appropriate version tag
4. Publish the package with the new version

By applying the correct labels during PR review, you ensure accurate and predictable versioning.
