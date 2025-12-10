#!/usr/bin/env node

/**
 * Automated Version Tagging Script
 * 
 * This script calculates and applies the next semantic version tag based on merged PR labels.
 * 
 * Logic:
 * - Retrieves the previous tag from git history
 * - Collects all PRs merged after the previous tag
 * - Determines version bump:
 *   - If any PR has 'breaking change' label → bump major version
 *   - Else if any PR has 'feature' label → bump minor version
 *   - Else → bump patch version
 */

const { execSync } = require('child_process');

function execCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options 
    }).trim();
  } catch (error) {
    if (options.allowError) {
      return null;
    }
    throw error;
  }
}

function getPreviousTag() {
  // Get the most recent tag
  const tag = execCommand('git describe --tags --abbrev=0', { allowError: true });
  
  if (!tag) {
    console.log('No previous tag found, starting from v0.0.0');
    return 'v0.0.0';
  }
  
  console.log(`Previous tag: ${tag}`);
  return tag;
}

function parseVersion(tag) {
  // Remove 'v' prefix if present and parse semantic version
  const version = tag.replace(/^v/, '');
  const parts = version.split('.').map(Number);
  
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid version format: ${tag}. Expected format: v1.2.3`);
  }
  
  return {
    major: parts[0],
    minor: parts[1],
    patch: parts[2]
  };
}

function bumpVersion(version, type) {
  const newVersion = { ...version };
  
  switch (type) {
    case 'major':
      newVersion.major += 1;
      newVersion.minor = 0;
      newVersion.patch = 0;
      break;
    case 'minor':
      newVersion.minor += 1;
      newVersion.patch = 0;
      break;
    case 'patch':
      newVersion.patch += 1;
      break;
    default:
      throw new Error(`Unknown version bump type: ${type}`);
  }
  
  return newVersion;
}

function formatVersion(version) {
  return `v${version.major}.${version.minor}.${version.patch}`;
}

function validateTag(tag) {
  // Validate tag format to prevent command injection
  // Only allow semantic version format: v1.2.3 or 1.2.3
  if (!/^v?\d+\.\d+\.\d+$/.test(tag)) {
    throw new Error(`Invalid tag format: ${tag}. Only semantic version tags are allowed (e.g., v1.2.3)`);
  }
  return tag;
}

function validatePRNumber(prNumber) {
  // Validate PR number to prevent command injection
  if (!/^\d+$/.test(prNumber)) {
    throw new Error(`Invalid PR number: ${prNumber}. Only numeric values are allowed`);
  }
  return prNumber;
}

function getMergedPRsSinceTag(tag) {
  let commits;
  
  if (tag === 'v0.0.0') {
    // Get all commits if no previous tag
    commits = execCommand('git log --oneline --no-decorate');
  } else {
    // Validate tag before using it in command
    const validatedTag = validateTag(tag);
    // Get commits since the tag
    commits = execCommand(`git log ${validatedTag}..HEAD --oneline --no-decorate`, { allowError: true });
  }
  
  if (!commits) {
    console.log('No new commits since last tag');
    return [];
  }
  
  const commitLines = commits.split('\n').filter(line => line.trim());
  const prNumbers = new Set();
  
  // Extract PR numbers from commit messages
  // GitHub automatically adds "Merge pull request #123" or "(#123)" to merge commits
  commitLines.forEach(line => {
    const prMatch = line.match(/#(\d+)/);
    if (prMatch) {
      prNumbers.add(prMatch[1]);
    }
  });
  
  return Array.from(prNumbers);
}

function getPRLabels(prNumber) {
  try {
    // Validate PR number before using it in command
    const validatedPRNumber = validatePRNumber(prNumber);
    // Use GitHub CLI if available
    const labels = execCommand(`gh pr view ${validatedPRNumber} --json labels --jq '.labels[].name'`, { allowError: true });
    
    if (labels) {
      return labels.split('\n').filter(l => l.trim());
    }
  } catch (error) {
    console.warn(`Warning: Could not fetch labels for PR #${prNumber}: ${error.message}`);
  }
  
  return [];
}

function determineVersionBump(prNumbers) {
  if (prNumbers.length === 0) {
    console.log('No PRs found, defaulting to patch bump');
    return 'patch';
  }
  
  console.log(`Analyzing ${prNumbers.length} merged PR(s)...`);
  
  let hasBreakingChange = false;
  let hasFeature = false;
  
  for (const prNumber of prNumbers) {
    console.log(`Checking PR #${prNumber}...`);
    const labels = getPRLabels(prNumber);
    
    console.log(`  Labels: ${labels.length > 0 ? labels.join(', ') : 'none'}`);
    
    if (labels.some(label => label.toLowerCase() === 'breaking change')) {
      hasBreakingChange = true;
      console.log(`  → Breaking change detected in PR #${prNumber}`);
    } else if (labels.some(label => label.toLowerCase() === 'feature')) {
      hasFeature = true;
      console.log(`  → Feature detected in PR #${prNumber}`);
    }
  }
  
  if (hasBreakingChange) {
    console.log('\nVersion bump decision: MAJOR (breaking change detected)');
    return 'major';
  } else if (hasFeature) {
    console.log('\nVersion bump decision: MINOR (feature detected)');
    return 'minor';
  } else {
    console.log('\nVersion bump decision: PATCH (default)');
    return 'patch';
  }
}

function createAndPushTag(tag, dryRun = false) {
  console.log(`\nCreating tag: ${tag}`);
  
  // Validate tag before using it in commands
  const validatedTag = validateTag(tag);
  
  if (dryRun) {
    console.log('[DRY RUN] Would create and push tag:', validatedTag);
    return;
  }
  
  // Create annotated tag
  execCommand(`git tag -a ${validatedTag} -m "Release ${validatedTag}"`);
  console.log(`Tag ${validatedTag} created successfully`);
  
  // Push tag to remote
  execCommand(`git push origin ${validatedTag}`);
  console.log(`Tag ${validatedTag} pushed to remote`);
}

function main() {
  console.log('=== Automated Version Tagging ===\n');
  
  // Check if we're in a git repository
  try {
    execCommand('git rev-parse --git-dir');
  } catch (error) {
    console.error('Error: Not a git repository');
    process.exit(1);
  }
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  if (dryRun) {
    console.log('[DRY RUN MODE - No changes will be made]\n');
  }
  
  try {
    // Step 1: Get previous tag
    const previousTag = getPreviousTag();
    
    // Step 2: Get merged PRs since tag
    const prNumbers = getMergedPRsSinceTag(previousTag);
    console.log(`Found ${prNumbers.length} PR(s) since ${previousTag}\n`);
    
    if (prNumbers.length === 0) {
      console.log('No new PRs merged since last tag. No version bump needed.');
      process.exit(0);
    }
    
    // Step 3: Determine version bump type
    const bumpType = determineVersionBump(prNumbers);
    
    // Step 4: Calculate new version
    const currentVersion = parseVersion(previousTag);
    const newVersion = bumpVersion(currentVersion, bumpType);
    const newTag = formatVersion(newVersion);
    
    console.log(`\nVersion bump: ${previousTag} → ${newTag} (${bumpType})`);
    
    // Step 5: Create and push tag
    createAndPushTag(newTag, dryRun);
    
    console.log('\n✓ Version tagging complete!');
    
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  getPreviousTag,
  parseVersion,
  bumpVersion,
  formatVersion,
  determineVersionBump
};
