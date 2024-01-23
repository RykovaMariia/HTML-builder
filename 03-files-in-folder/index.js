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
        let fileExt = path.extname(pathFile);
        const fileName = file.name.slice(0, file.name.lastIndexOf(fileExt));
        const stat = await fs.promises.stat(pathFile);

        if (stat.isFile()) {
          console.log(`${fileName} - ${fileExt.slice(1)} - ${stat.size}bytes`);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
