import { exec } from ".";

const escapeInvalidCharacters = (command: string, charactersRegexp: string) =>
    command.replace(new RegExp(`([${charactersRegexp}\\\\])`, "g"), "\\$1");

export const execInPowershell = async (command: string) => {
    const escapedCommand = `powershell -Command "${escapeInvalidCharacters(command, '"')}"`;
    await exec(escapedCommand);
};

export const openPowershellWithCommand = async (
    command: string,
    options?: Partial<{
        asAdmin: boolean;
    }>
) => {
    const escapedCommand = [
        "Start-Process PowerShell",
        options?.asAdmin ? "-Verb RunAs" : undefined,
        `-ArgumentList '-NoExit', '-Command', '${escapeInvalidCharacters(command, "'")}'`,
    ]
        .filter((x) => x !== undefined)
        .join(" ");

    await execInPowershell(escapedCommand);
};
