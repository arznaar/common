module.exports = function (api) {
    api.cache(true);

    const presets = [
        "@babel/preset-typescript",
        ["@babel/preset-env", { targets: { node: "current" } }],
    ];
    const plugins = [
        // optimizes lodash as it highly popular
        "lodash",
        "@babel/plugin-proposal-optional-chaining",
    ];

    return {
        presets,
        plugins,
        babelrc: false
    };
};
