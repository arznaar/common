import { spawn } from "child_process";
import { EOL } from "os";

const splitForSpawn = (command: string): [string, string[]] => {
    const trimmed = command.trim();
    const firstSpace = trimmed.indexOf(" ");
    return firstSpace !== -1 ? [trimmed.slice(0, firstSpace), [trimmed.slice(firstSpace + 1)]] : [trimmed, []];
};

const transformChunk = (data: string | Buffer) => {
    const result = data
        .toString()
        .split(EOL)
        .map((x) => x.trim())
        .join("\n");
    return result[result.length - 1] === "\n" ? result.slice(0, -1) : result;
};

/**
 * exec wrapped in promise to programmatically getting the results. If you want to pipe logs - it's better to use
 * native one
 */
export const exec = async (
    command: string,
    options?: Partial<{
        /**
         * error code should actually means is the program failed or not and some programs just output debug info into
         * stderr. So, by default, we don't throw on such messages, but we can
         * */
        throwOnError: boolean;
        isErrorInStdOut: (data: string) => boolean;
        cwd: string;
    }>,
) => {
    const [runner, args] = splitForSpawn(command);
    const newProcess = spawn(runner, args, { shell: true, cwd: options?.cwd });
    const logs: Array<{
        isError: boolean;
        value: string;
    }> = [];
    newProcess.stdout.on("data", (data) => {
        const dataText = transformChunk(data);
        logs.push({
            isError: !!options?.isErrorInStdOut?.(dataText),
            value: dataText,
        });
    });

    newProcess.stderr.on("data", (data) => {
        logs.push({
            isError: !!options?.throwOnError,
            value: transformChunk(data),
        });
    });

    await new Promise((res, rej) => {
        const onClose = () => {
            if (logs.some((x) => x.isError)) {
                rej(new Error(`Command failed with logs:\n${logs.map((x) => x.value).join("\n")}`));
                return;
            }
            res();
        };

        newProcess.on("error", (error) => {
            logs.push({
                isError: true,
                value: JSON.stringify({
                    error,
                    message: error?.message,
                    stack: error?.stack,
                }),
            });
            onClose();
        });

        newProcess.on("close", (code) => {
            if (code !== 0) {
                logs.push({
                    isError: true,
                    value: `Command failed with error code ${code}`,
                });
            }
            onClose();
        });
    });
    return logs
        .filter((x) => !x.isError)
        .map((x) => x.value)
        .join("\n");
};
