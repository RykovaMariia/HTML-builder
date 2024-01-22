const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const pathFolder = path.join(__dirname, 'secret-folder');

    const folderData = await fs.promises.readdir(pathFolder, {
      withFileTypes: true,
    });
    for (let file of folderData) {
      if (file.isFile()) {
        const pathFile = path.join(pathFolder, file.name);
        const fileName = file.name.split('.')[0];
        const fileExt = path.extname(pathFile).slice(1);
        const stat = await fs.promises.stat(pathFile);

        if (stat.isFile()) {
          console.log(`${fileName} - ${fileExt} - ${stat.size}bytes`);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
