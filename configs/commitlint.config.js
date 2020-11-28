module.exports = {
    extends: ['@commitlint/config-conventional'],
    ignores: [
        // ignore dependabot as it creates commit automatically and we can't control it
        (message) => message.startsWith(`fix(deps): bump`),
    ]
};
