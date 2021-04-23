import fsx from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON } = fsx;

export const dataFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);

export const getMedia = async () => {
  return await readJSON(join(dataFolder, "media.json"));
};

export const writeMedia = async (content) => {
  return await writeJSON(join(dataFolder, "media.json"), content);
};
