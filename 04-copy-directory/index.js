const fs = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const pathFolderCopy = path.join(__dirname, 'files-copy');
    const pathFolder = path.join(__dirname, 'files');

    const isFolderCopyExists = await fs
      .access(pathFolderCopy)
      .then(() => true)
      .catch(() => false);

    if (isFolderCopyExists) {
      await fs.rm(pathFolderCopy, { recursive: true }, { force: true });
    }

    await fs.mkdir(pathFolderCopy, { recursive: true });
    await copyFiles(pathFolder, pathFolderCopy);
  } catch (err) {
    console.log(err);
  }
})();

async function copyFiles(pathFolder, pathFolderCopy) {
  try {
    let folderFiles = await fs.readdir(pathFolder, { withFileTypes: true });

    for (let file of folderFiles) {
      const pathFile = path.join(pathFolder, file.name);
      const pathFileCopy = path.join(pathFolderCopy, file.name);

      if (file.isFile()) {
        await fs.copyFile(pathFile, pathFileCopy);
      } else if (file.isDirectory()) {
        await fs.mkdir(path.join(pathFolderCopy, file.name), {
          recursive: true,
        });
        await copyFiles(
          path.join(pathFolder, file.name),
          path.join(pathFolderCopy, file.name),
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
}
