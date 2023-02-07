import { writeFile } from "node:fs/promises";
import { copyFile } from "node:fs/promises";

import findUp from "find-up";

import { exec } from "./exec";

/**
 * @see https://github.com/yarnpkg/yarn/issues/5201#issuecomment-1059988319 (v1)
 * @see https://github.com/yarnpkg/yarn/issues/5201#issuecomment-1098199645 (v2)
 */
const addDeps = async (packagePath: string, dependencies: string[]): Promise<void> => {
  const pkg = require(packagePath);

  // Ensure section exists
  pkg.dependencies = pkg.dependencies || {};

  // Copy from devDependencies
  for (const dep of dependencies) {
    console.info(`Copying from devDependencies: ${dep}`);
    pkg.dependencies[dep] = pkg.devDependencies[dep];
  }

  await writeFile(packagePath, JSON.stringify(pkg));
  console.debug(`Wrote ${packagePath}`, pkg);
  await exec("yarn install --frozen-lockfile --production");
};

const main = async (dependencies: string[]): Promise<void> => {
  if (!dependencies.length) {
    console.warn("No dependencies to install; Skipping.");

    return;
  }

  const packagePath = await findUp("package.json");

  if (!packagePath) {
    throw new Error("Could not find package.json");
  }

  const backupPath = `${packagePath}.bak`;

  console.info(`Creating backup: ${packagePath} -> ${backupPath}`);
  await copyFile(packagePath, backupPath);

  try {
    await addDeps(packagePath, dependencies);
  } finally {
    await copyFile(backupPath, packagePath);
    console.info(`Restored backup: ${backupPath} -> ${packagePath}`);
  }
};

main(process.argv.slice(2))
  .catch(e => console.error(e));