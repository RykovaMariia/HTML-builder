const fs = require('fs/promises');
const path = require('path');

const pathFolder = path.join(__dirname, 'styles');
const pathFileProject = path.join(__dirname, 'project-dist', 'bundle.css');

(async () => {
  const isFileExists = await fs
    .access(pathFileProject)
    .then(() => true)
    .catch(() => false);

  if (isFileExists) {
    await fs
      .rm(pathFileProject, { recursive: true }, { force: true })
      .then(() => console.log('bundle.css was deleted'))
      .catch((error) => console.log(error));
  }
  mergeStyle();
})();

async function mergeStyle() {
  await fs.readdir(pathFolder, { withFileTypes: true }).then((data) => {
    for (let file of data) {
      const pathFile = path.join(pathFolder, file.name);
      const fileExt = path.extname(pathFile);

      if (file.isFile() && fileExt === '.css') {
        fs.readFile(pathFile, 'utf-8').then((dataFile) => {
          fs.appendFile(pathFileProject, dataFile);
        });
      }
    }
  });
}
