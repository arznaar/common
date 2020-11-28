module.exports = {
    restoreMocks: true,
    testEnvironment: "node",
    testMatch: [
        "**/?(*.)+(test).ts?(x)",
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.test.ts",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["lcov"],
};
