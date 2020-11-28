module.exports = {
    root: true,

    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        // this repo is used as template - leave this comment
        // ecmaFeatures: {
        //     "jsx": true
        // }
    },
    plugins: [
        "@typescript-eslint",
        "prettier",
        "import",
        // this repo is used as template - leave this comment
        // "react"
    ],

    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        // this repo is used as template - leave this comment
        // "plugin:react/recommended",
        "prettier",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint",
        "prettier/babel",
        "prettier/react"
    ],
    rules: {
        // I strongly believe that types should be inferred when possible
        "@typescript-eslint/explicit-module-boundary-types": "off",
        // this rule is bad and just causes addition of 2 ignores instead of 1
        "@typescript-eslint/ban-ts-comment": "off",
        // 120 is more readable in diffs on most screens and you can't usually break urls
        "max-len": ["error", { "code": 120, "ignoreUrls": true }],
        // just a helper to cleanup paths after copy-pasting
        "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
        // more readable
        "import/newline-after-import": "error",
        // less merge conflicts and more imports with small cost. Autofixable
        "import/order": ["error", { alphabetize: { order: "asc" } }],
    },
};
