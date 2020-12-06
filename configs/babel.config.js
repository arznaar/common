module.exports = function (api) {
    api.cache(true);

    const presets = [
        "@babel/preset-typescript",
        ["@babel/preset-env", { targets: { node: "current" } }],
    ];
    const plugins = [
        // optimizes lodash as it highly popular
        "lodash",
    ];

    return {
        presets,
        plugins,
        babelrc: false
    };
};
