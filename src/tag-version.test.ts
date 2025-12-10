/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

const {
    parseVersion,
    bumpVersion,
    formatVersion,
} = require("../scripts/tag-version");

describe("Version Tagging Script", () => {
    describe("parseVersion", () => {
        test("should parse version with v prefix", () => {
            const version = parseVersion("v1.2.3");
            expect(version).toEqual({ major: 1, minor: 2, patch: 3 });
        });

        test("should parse version without v prefix", () => {
            const version = parseVersion("1.2.3");
            expect(version).toEqual({ major: 1, minor: 2, patch: 3 });
        });

        test("should throw error for invalid version format", () => {
            expect(() => parseVersion("invalid")).toThrow("Invalid version format");
            expect(() => parseVersion("v1.2")).toThrow("Invalid version format");
            expect(() => parseVersion("v1.2.x")).toThrow("Invalid version format");
        });
    });

    describe("bumpVersion", () => {
        const baseVersion = { major: 1, minor: 2, patch: 3 };

        test("should bump major version and reset minor and patch", () => {
            const newVersion = bumpVersion(baseVersion, "major");
            expect(newVersion).toEqual({ major: 2, minor: 0, patch: 0 });
        });

        test("should bump minor version and reset patch", () => {
            const newVersion = bumpVersion(baseVersion, "minor");
            expect(newVersion).toEqual({ major: 1, minor: 3, patch: 0 });
        });

        test("should bump patch version", () => {
            const newVersion = bumpVersion(baseVersion, "patch");
            expect(newVersion).toEqual({ major: 1, minor: 2, patch: 4 });
        });

        test("should throw error for unknown bump type", () => {
            expect(() => bumpVersion(baseVersion, "invalid")).toThrow("Unknown version bump type");
        });

        test("should not modify original version object", () => {
            const original = { major: 1, minor: 2, patch: 3 };
            bumpVersion(original, "major");
            expect(original).toEqual({ major: 1, minor: 2, patch: 3 });
        });
    });

    describe("formatVersion", () => {
        test("should format version with v prefix", () => {
            const formatted = formatVersion({ major: 1, minor: 2, patch: 3 });
            expect(formatted).toBe("v1.2.3");
        });

        test("should format version with zeros", () => {
            const formatted = formatVersion({ major: 0, minor: 0, patch: 1 });
            expect(formatted).toBe("v0.0.1");
        });
    });

    describe("Integration: parseVersion and formatVersion", () => {
        test("should be reversible operations", () => {
            const original = "v1.2.3";
            const parsed = parseVersion(original);
            const formatted = formatVersion(parsed);
            expect(formatted).toBe(original);
        });
    });

    describe("Integration: full version bump flow", () => {
        test("should correctly bump from v1.2.3 to v2.0.0 for major", () => {
            const current = parseVersion("v1.2.3");
            const bumped = bumpVersion(current, "major");
            const formatted = formatVersion(bumped);
            expect(formatted).toBe("v2.0.0");
        });

        test("should correctly bump from v1.2.3 to v1.3.0 for minor", () => {
            const current = parseVersion("v1.2.3");
            const bumped = bumpVersion(current, "minor");
            const formatted = formatVersion(bumped);
            expect(formatted).toBe("v1.3.0");
        });

        test("should correctly bump from v1.2.3 to v1.2.4 for patch", () => {
            const current = parseVersion("v1.2.3");
            const bumped = bumpVersion(current, "patch");
            const formatted = formatVersion(bumped);
            expect(formatted).toBe("v1.2.4");
        });
    });
});
