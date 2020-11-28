const config = require("./base.eslintrc.js");

module.exports = {
    ...config,

    parserOptions: {
        ...config.parserOptions,
        ecmaFeatures: {
            "jsx": true,
        },
    },

    plugins: [
        ...config.plugins,
        "react",
    ],

    extends: [
        ...config.extends,
        "plugin:react/recommended",
    ],

    rules: {
        ...config.rules,

        "react/jsx-closing-bracket-location": [1, "line-aligned"],
    }
};
