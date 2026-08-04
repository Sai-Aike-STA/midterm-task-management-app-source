# CSX4107 Midterm Point of Sale

This is the source-code repository for the CSX4107 Web Application
Development midterm examination project.

## Exam instructions

The official examination requirements and expected output are available in
[WAD 2026-1 Midterms Exam Instructions](<resources/WAD 2026-1 Midterms Exam Instructions.docx>).

Static deployment repository:
<https://github.com/Sai-Aike-STA/midterm-task-management-app>

GitHub Pages base path: `/midterm-task-management-app/`

Hosted application:
<https://sai-aike-sta.github.io/midterm-task-management-app/>

## Application features

- Category and product selection using the provided data
- Product filtering based on the selected category
- Conditional Amount input and Add Item button states
- Inventory validation and error messages
- Inventory deduction after purchases
- Purchase-list updates without duplicate product rows
- Product category icons
- Discounted subtotals and a recalculated grand total

## Run locally

```bash
npm install
npm run dev
```

## Build the static application

```bash
npm run build
```

## Refreshing the deployment repository

```bash
./deploy.sh
```

The script performs these steps:

1. Builds the source project.
2. Clears the old deployment files while preserving its `.git` directory.
3. Copies the new `dist` contents into the deployment repository.
4. Copies `README-DIST.md` as the deployment repository's `README.md`.
5. Displays the deployment repository's Git status for review.

The local deployment repository is `csx4107-midterm-task-manager-app-dist`.
It is pushed to the `midterm-task-management-app` GitHub repository for
GitHub Pages.

### Repeat-run behavior

The script is idempotent when its inputs are unchanged. Running it multiple
times with the same source code, dependencies, and build configuration leaves
the deployment repository with the same tracked contents.

Changes to the source code, dependencies, `README-DIST.md`, or build
configuration are inputs. When any of them changes, a later run is expected to
produce a different deployment state.

The script protects the deployment repository in three ways:

- It checks the exact deployment directory name.
- It requires the deployment directory to contain `.git`.
- It checks that `README-DIST.md` exists before clearing old files.

The clearing command removes every direct child except `.git`. Therefore, Git
history and the configured remote are preserved. The deployment README is then
recreated from the source-controlled `README-DIST.md` template.

The script deliberately does not commit or push. After reviewing its output,
the deployment can be published with:

```bash
cd ../csx4107-midterm-task-manager-app-dist
git add -A
git commit -m "refresh hosted build"
git push
```


---
## Local Source Stuff
Local source directory: `csx4107-midterm-task-manager-app`

Source code repository:
<https://github.com/Sai-Aike-STA/midterm-task-management-app-source>
