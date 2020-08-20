module.exports = {
    clearMocks: true,
    testEnvironment: "node",
    testMatch: [
        "**/?(*.)+(test).ts?(x)",
    ],

    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/**/*.test.js",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["lcov"],
};
