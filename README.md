# CSX4107 Midterm Point of Sale

This is the source-code repository for the CSX4107 Web Application
Development midterm examination project.

Local source directory: `csx4107-midterm-task-manager-app`

Source code repository:
<https://github.com/Sai-Aike-STA/midterm-task-management-app-source>

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

The built files in `dist` are copied into the local
`csx4107-midterm-task-manager-app-dist` repository. That local repository is
pushed to the `midterm-task-management-app` GitHub repository for GitHub Pages.
