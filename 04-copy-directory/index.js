const fs = require('fs');
const path = require('path');

let pathFolderCopy = path.join(__dirname, 'files-copy');
let pathFolder = path.join(__dirname, 'files');

(async () => {
  const isFolderExists = await fs.promises
    .access(pathFolderCopy)
    .then(() => true)
    .catch(() => false);

  if (isFolderExists) {
    await fs.promises
      .rm(pathFolderCopy, { recursive: true }, { force: true })
      .then(() => console.log('copy folder was deleted'))
      .catch((error) => console.log(error));
  }

  await fs.promises
    .mkdir(pathFolderCopy, { recursive: true })
    .then(() => {
      console.log('copy folder "files-copy" was created\n');
      copy(pathFolder, pathFolderCopy);
    })
    .catch((error) => console.log(error));
})();

async function copy(pathFolder, pathFolderCopy) {
  let data = await fs.promises.readdir(pathFolder, {
    withFileTypes: true,
  });

  for (let file of data) {
    const pathFile = path.join(pathFolder, file.name);
    const pathFileCopy = path.join(pathFolderCopy, file.name);

    if (file.isFile()) {
      await fs.promises.copyFile(pathFile, pathFileCopy).then(() => {
        console.log(`file ${file.name} was copied`);
      });
    } else if (file.isDirectory()) {
      fs.promises
        .mkdir(path.join(pathFolderCopy, file.name), { recursive: true })
        .then(() => {
          console.log(`copy folder "${file.name}" was created\n`);
          copy(
            path.join(pathFolder, file.name),
            path.join(pathFolderCopy, file.name),
          );
        })
        .catch((error) => console.log(error));
    }
  }
}
