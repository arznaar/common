# Scripts

This directory contains automation scripts for the repository.

## tag-version.js

Automated semantic version tagging script based on merged PR labels.

### Usage

```bash
# Run with actual tagging and pushing
node scripts/tag-version.js

# Run in dry-run mode to see what would happen without making changes
node scripts/tag-version.js --dry-run
```

### How it works

1. Retrieves the most recent git tag
2. Finds all PRs merged since that tag (by extracting PR numbers from commit messages)
3. Fetches labels for each PR using GitHub CLI (`gh`)
4. Determines version bump based on labels:
   - If any PR has `breaking change` label → **major** version bump (e.g., v1.2.3 → v2.0.0)
   - Else if any PR has `feature` label → **minor** version bump (e.g., v1.2.3 → v1.3.0)
   - Else → **patch** version bump (e.g., v1.2.3 → v1.2.4)
5. Creates an annotated git tag with the new version
6. Pushes the tag to the remote repository

### Requirements

- Git repository with tags in semantic version format (v1.2.3)
- GitHub CLI (`gh`) installed and authenticated
- Proper permissions to create and push tags to the repository

### Integration

This script is automatically run by the publish GitHub Actions workflow (`.github/workflows/publish.yml`) when PRs are merged to the default branch.

### PR Labeling

For the script to work correctly, PRs must be labeled appropriately during review. See `.github/copilot-instructions.md` for labeling guidelines.
