import fs from "fs";

export async function checkLastModified(filePath) {
  try {
    const stats = await fs.promises.stat(filePath);
    const { mtimeMs } = stats;
    const modifiedDate = new Date(mtimeMs).toISOString().split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];

    return modifiedDate !== currentDate;
  } catch (error) {
    return true;
  }
}

checkLastModified("./products.json");
