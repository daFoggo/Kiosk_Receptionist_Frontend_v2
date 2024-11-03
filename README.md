
# Project structrue

```
└── 📁My_basic_React_Shadcn_base
    └── 📁public
        └── vite.svg
    └── 📁src
        └── 📁assets
            └── 📁fonts // Add your custom font here
                └── 📁ClashDisplay
            └── 📁images 
            └── react.svg
        └── 📁components
            // Your components
            └── 📁ConfirmDialog
                └── index.tsx
            └── 📁ReuseDonutChart
                └── index.tsx
            ...
            // Shadcn components
            └── 📁ui
                └── accordion.tsx
                └── avatar.tsx
                └── badge.tsx
                ...
        └── 📁contexts
        └── 📁hooks
        └── 📁layouts
            // layouts for diffrent types of page
            └── 📁RootLayout
                └── RootLayout.tsx
        └── 📁lib
            └── utils.ts
        └── 📁models // interfaces and columns define for components
            └── 📁ConfirmDialog
                └── type.d.ts
            └── 📁ReuseDonutChart
                └── type.d.ts
            ...
        └── 📁pages 
            └── 📁Home
                └── index.tsx
        └── 📁router
            └── router.tsx
            └── routerConfig.ts //
        └── 📁utils
            └── 📁Helper // if a component have a complicated helper function or it cant be reusable much, 
                         // put them in a Folder with the component's name
                └── common.ts
            └── constant.ts
            └── ip.ts
        └── App.css
        └── App.tsx
        └── index.css
        └── main.tsx
        └── vite-env.d.ts
    └── .env
    └── .gitignore
    └── components.json // Shadcn's thing
    └── eslint.config.js
    └── index.html
    └── package-lock.json
    └── package.json
    └── postcss.config.js
    └── README.md
    └── tailwind.config.js // Modify tailwind theme
    └── tsconfig.app.json
    └── tsconfig.json
    └── tsconfig.node.json
    └── vite.config.ts
```
