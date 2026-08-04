#!/usr/bin/env bash

set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SOURCE_DIR}/.." && pwd)/csx4107-midterm-task-manager-app-dist"
EXPECTED_DEPLOY_NAME="csx4107-midterm-task-manager-app-dist"

if [[ "$(basename "${DEPLOY_DIR}")" != "${EXPECTED_DEPLOY_NAME}" ]]; then
  printf 'Unexpected deployment directory: %s\n' "${DEPLOY_DIR}"
  exit 1
fi

if [[ ! -d "${DEPLOY_DIR}/.git" ]]; then
  printf 'Deployment Git repository was not found: %s\n' "${DEPLOY_DIR}"
  exit 1
fi

printf 'Building the source project...\n'
cd "${SOURCE_DIR}"
npm run build

# Vite may leave this macOS file in dist because it is hidden.
rm -f "${SOURCE_DIR}/dist/.DS_Store"

printf 'Clearing the old deployment files while preserving .git...\n'
find "${DEPLOY_DIR}" \
  -mindepth 1 \
  -maxdepth 1 \
  ! -name '.git' \
  -exec rm -rf -- {} +

printf 'Copying the new dist files...\n'
cp -R "${SOURCE_DIR}/dist/." "${DEPLOY_DIR}/"

printf 'Refreshing the deployment README...\n'
cp "${SOURCE_DIR}/README-DIST.md" "${DEPLOY_DIR}/README.md"

printf '\nDeployment repository changes:\n'
git -C "${DEPLOY_DIR}" status --short
