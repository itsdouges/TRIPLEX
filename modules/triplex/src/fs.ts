import { HttpError } from 'https://deno.land/x/oak@v11.1.0/mod.ts';

export function findParentFile(fileName: string, levels = 5) {
  let filePath = './';

  while (levels) {
    for (const dirEntry of Deno.readDirSync(filePath)) {
      if (dirEntry.name === fileName) {
        return Deno.cwd() + '/' + filePath + fileName;
      }
    }

    filePath += '../';
    levels -= 1;
  }

  return undefined;
}

export function findParentFileOrThrow(fileName: string) {
  const file = findParentFile(fileName);
  if (!file) {
    throw new HttpError(`${fileName} not found in the fs`);
  }

  return file;
}
