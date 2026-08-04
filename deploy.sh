#!/usr/bin/env bash
# The shebang runs this file with the Bash program found in the environment.

# -e stops when a command fails.
# -u stops when an undefined variable is used.
# pipefail makes a pipeline fail when any command in it fails.
set -euo pipefail

# BASH_SOURCE[0] is the path of this script.
# dirname gets the directory part of that path.
# cd and pwd turn it into an absolute path for the source repository.
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# The deployment repository must be beside the source repository.
DEPLOY_DIR="$(cd "${SOURCE_DIR}/.." && pwd)/csx4107-midterm-task-manager-app-dist"

# This exact name is used as a safety check before any files are removed.
EXPECTED_DEPLOY_NAME="csx4107-midterm-task-manager-app-dist"

# basename returns only the final directory name.
# The script stops if the calculated deployment name is unexpected.
if [[ "$(basename "${DEPLOY_DIR}")" != "${EXPECTED_DEPLOY_NAME}" ]]; then
  printf 'Unexpected deployment directory: %s\n' "${DEPLOY_DIR}"
  exit 1
fi

# The deployment directory must already be a Git repository.
# This check prevents the script from clearing an unrelated directory.
if [[ ! -d "${DEPLOY_DIR}/.git" ]]; then
  printf 'Deployment Git repository was not found: %s\n' "${DEPLOY_DIR}"
  exit 1
fi

# The README template must exist before the old deployment files are cleared.
if [[ ! -f "${SOURCE_DIR}/README-DIST.md" ]]; then
  printf 'Deployment README template was not found.\n'
  exit 1
fi

printf 'Building the source project...\n'

# The build command must run from the source repository.
cd "${SOURCE_DIR}"

# Vite creates a new production build inside the source dist directory.
npm run build

# Vite may leave this macOS file in dist because it is hidden.
rm -f "${SOURCE_DIR}/dist/.DS_Store"

printf 'Clearing the old deployment files while preserving .git...\n'

# find looks only at the direct children of the deployment repository.
# mindepth prevents the deployment directory itself from being selected.
# maxdepth prevents find from walking deeper than the direct children.
# The .git directory is excluded so the repository history is preserved.
# Every other direct child is removed before the new build is copied.
find "${DEPLOY_DIR}" \
  -mindepth 1 \
  -maxdepth 1 \
  ! -name '.git' \
  -exec rm -rf -- {} +

printf 'Copying the new dist files...\n'

# dist/. means every file inside dist is copied, not the dist folder itself.
cp -R "${SOURCE_DIR}/dist/." "${DEPLOY_DIR}/"

printf 'Refreshing the deployment README...\n'

# The source-controlled template becomes README.md in the hosted repository.
cp "${SOURCE_DIR}/README-DIST.md" "${DEPLOY_DIR}/README.md"

printf '\nDeployment repository changes:\n'

# -C runs Git inside the deployment repository without changing directories.
# The script only shows changes. It does not commit or push automatically.
git -C "${DEPLOY_DIR}" status --short
