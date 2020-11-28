import { exec } from "./shell";

const query = async (database: string, sql: string) => {
    const result = await exec(`sqlcmd -S "${database}" -Q "${sql}"`, {
        isErrorInStdOut: (data) => data.startsWith("Msg "),
    });

    // cleanup useful data from answer like:
    /*
        name
        ----------------------------------------------------------
        DatabaseName

        (1 rows affected)
    */
    return (
        result
            .split("\n")
            // sql response contains a lot of strange spaces
            .map((x) => x.trim())
            // sql response contains a lot of empty lines
            .filter((x) => x.length > 0)
            // sql response starts with headers+separator and ends with affected rows counter
            .slice(2, -1)
    );
};

export const isTableExists = async (database: string, name: string) =>
    (await query(database, `SELECT name FROM sys.databases WHERE name = N'${name}'`)).length > 0;

/**
 * @throws Throws error if db doesn't exists
 */
export const dropDatabase = async (
    database: string,
    name: string,
    params: {
        noCheck?: boolean;
    } = {}
) => {
    await query(
        database,
        params.noCheck
            ? `DROP DATABASE [${name}]`
            : `IF EXISTS (SELECT name FROM sys.databases WHERE name = N'${name}') DROP DATABASE [${name}]`
    );
};

export const getAllDatabases = async (database: string) => {
    return await query(
        database,
        [
            "SELECT name",
            "FROM sys.databases",
            "WHERE name NOT IN ('master' ,'tempdb' ,'model' ,'msdb' ,'ReportServer' ,'ReportServerTempDB')",
        ].join(" ")
    );
};
