import * as fs from 'fs';
import * as path from 'path';

export class FileUtil {
  /**
   * Reads and converts SQL scripts into an array of strings.
   * This method finds the specified SQL file using the {@link path}
   * module and then removes line breaks from the SQL script.
   *
   * @param name The name of the .sql file.
   * @returns An array of SQL scripts extracted from the file.
   * @see https://stackoverflow.com/questions/57290140/how-to-run-typeorm-mysql-commands-from-sql-file
   */
  public static readonly READ_FILE = (name: string): string[] =>
    fs
      .readFileSync(path.resolve(__dirname, name))
      .toString()
      .replace(/\r?\n|\r/g, '')
      .split(';')
      .filter((query) => query?.length);
}
