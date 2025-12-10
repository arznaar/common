# @arznaar/common

Personal collection of configs, docs and reused code. It's public only to play with github's apiblic repos features.
It's highly biased and I recommend to use it only as reference.

**Warning**: package is volatile and can delete/change it's api on a whim - don't depend on it in a long term.

## Requirements and development

- use dev container in repo and keep it updated
- keep package.json scripts updated and clean

## Versioning

This repository uses automated semantic versioning based on PR labels:
- Add `feature` label to PRs that introduce new features (triggers minor version bump)
- Add `breaking change` label to PRs with backward-incompatible changes (triggers major version bump)
- All other PRs trigger a patch version bump

See [.github/copilot-instructions.md](./.github/copilot-instructions.md) for detailed labeling guidelines.

## Docs

- [./docs/development.md](./docs/development.md)
- [./docs/typescript.md](./docs/typescript.md)
