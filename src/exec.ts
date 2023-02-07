import { spawn } from "node:child_process";
import { EOL } from "node:os";

import type { Readable } from "node:stream";

/**
 * Consume stream, split by newlines.
 *
 * @author Elan Ruusamäe <glen@pld-linux.org>
 */
const getStreamData = async (stream: Readable): Promise<string[]> => {
  const lines = [];

  for await (const data of stream) {
    lines.push(data);
  }

  return lines
    .join("")
    .trim()
    .split(EOL);
};

/**
 * Execute a command, return stdout on success,
 * throw Error on error with output from stderr.
 *
 * @author Elan Ruusamäe <glen@pld-linux.org>
 */
export const exec = async (command: string): Promise<string[]> => {
  const [cmd, ...args] = command.split(" ");
  const cp = spawn(cmd, args);

  const [out, err] = await Promise.all([
    getStreamData(cp.stdout),
    getStreamData(cp.stderr),
  ]);

  if (cp.exitCode) {
    throw new Error(err.length ? err.join("\n") : `Process exited with code ${cp.exitCode}`);
  }

  return out;
};
