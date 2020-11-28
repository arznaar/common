module.exports = {
    root: true,

    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
        "import",
    ],

    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
    ],
    rules: {
        // I strongly believe that types should be inferred when possible
        "@typescript-eslint/explicit-module-boundary-types": "off",

        // this rule is bad and just causes addition of 2 ignores instead of 1
        "@typescript-eslint/ban-ts-comment": "off",

        // just a helper to cleanup paths after copy-pasting
        "import/no-useless-path-segments": ["error", { noUselessIndex: true }],

        // less merge conflicts and more imports with small cost. Autofixable
        "import/order": ["error", { alphabetize: { order: "asc" } }],

        // more readable with separated imports from code as you usually skip reading imports initially
        "import/newline-after-import": "error",

        // 120 is more readable in diffs on most screens and you can't usually break urls
        "max-len": ["error", { "code": 120, "ignoreUrls": true }],

        // more than 3 items easier to read in column
        "function-paren-newline": ["error", "multiline-arguments"],

        // less conflicts and easier to add new items
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline",
        }],

        // single quote is a apostrophe that is common in text
        "quotes": ["error", "double"],

        // most default one
        "indent": ["error", 4],

        // common invisible error
        "no-cond-assign": "error",

        // better diffs and readability
        "newline-per-chained-call": "error",

        // more readable
        "object-curly-spacing": ["error", "always"],

        // more stable and less conflict prone
        "arrow-parens": ["error", "always"],
    },

    reportUnusedDisableDirectives: true,
};
