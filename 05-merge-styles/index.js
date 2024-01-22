const fs = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const pathFileProject = path.join(__dirname, 'project-dist', 'bundle.css');

    const isFileProjectExists = await fs
      .access(pathFileProject)
      .then(() => true)
      .catch(() => false);

    if (isFileProjectExists) {
      await fs.rm(pathFileProject, { recursive: true }, { force: true });
    }
    await mergeStyle(pathFileProject);
  } catch (err) {
    console.log(err);
  }
})();

async function mergeStyle(pathFileProject) {
  try {
    const pathFolder = path.join(__dirname, 'styles');

    const folderData = await fs.readdir(pathFolder, { withFileTypes: true });

    for (let file of folderData) {
      const pathFile = path.join(pathFolder, file.name);
      const fileExt = path.extname(pathFile);

      if (file.isFile() && fileExt === '.css') {
        await fs.readFile(pathFile, 'utf-8').then((dataFile) => {
          fs.appendFile(pathFileProject, dataFile);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
