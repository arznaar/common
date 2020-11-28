module.exports = {
    branches: ["develop"],
    plugins: [
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        ["@semantic-release/github", {
            successComment: false,
            releasedLabels: false,
        }],
    ]
};