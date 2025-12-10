const tseslint = require("typescript-eslint");
const importPlugin = require("eslint-plugin-import");

module.exports = tseslint.config(
    {
        ignores: ["node_modules", "dist", "coverage"],
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module",
            },
        },

        plugins: {
            "@typescript-eslint": tseslint.plugin,
            "import": importPlugin,
        },

        rules: {
            // ESLint recommended rules
            ...require("@eslint/js").configs.recommended.rules,

            // TypeScript ESLint recommended rules
            ...tseslint.configs.recommended.reduce((acc, config) => {
                return { ...acc, ...config.rules };
            }, {}),
            ...tseslint.configs.recommendedTypeChecked.reduce((acc, config) => {
                return { ...acc, ...config.rules };
            }, {}),

            // Import plugin rules
            "import/no-unresolved": "error",
            "import/named": "error",
            "import/default": "error",
            "import/namespace": "error",
            "import/no-absolute-path": "error",
            "import/no-dynamic-require": "error",
            "import/no-self-import": "error",
            "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
            "import/order": ["error", { alphabetize: { order: "asc" } }],
            "import/newline-after-import": "error",

            // Custom rules from original config
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "max-len": ["error", { "code": 120, "ignoreUrls": true }],
            "function-paren-newline": ["error", "multiline-arguments"],
            "comma-dangle": ["error", {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "always-multiline",
            }],
            "quotes": ["error", "double"],
            "indent": ["error", 4],
            "no-cond-assign": "error",
            "newline-per-chained-call": "error",
            "object-curly-spacing": ["error", "always"],
            "arrow-parens": ["error", "always"],
        },

        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },

        settings: {
            "import/resolver": {
                typescript: true,
                node: true,
            },
        },
    }
);
