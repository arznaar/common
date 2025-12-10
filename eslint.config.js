const config = require("./configs/base.eslint.config.js");

module.exports = [
    {
        ignores: ["node_modules/**", "dist/**", "coverage/**"],
    },
    ...config,
];
