import fsx from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON } = fsx;

export const dataFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);

export const getReviews = async () => {
  return await readJSON(join(dataFolder, "reviews.json"));
};

export const writeReviews = async (content) => {
  return await writeJSON(join(dataFolder, "reviews.json"), content);
};
