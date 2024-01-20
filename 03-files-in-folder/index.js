const fs = require('fs');
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');

fs.promises
  .readdir(pathFolder, { withFileTypes: true })
  .then((data) => {
    data.forEach((file) => {
      const pathFile = path.join(pathFolder, file.name);
      if (file.isFile()) {
        const fileName = file.name.split('.')[0];
        const fileExt = path.extname(pathFile).slice(1);
        let fileSize = 0;
        fs.promises
          .stat(pathFile)
          .then((stats) => {
            if (stats.isFile()) {
              fileSize = stats.size / 1024;
              console.log(`${fileName}-${fileExt}-${fileSize}kb`);
            }
          })
          .catch((error) => console.log(error));
      }
    });
  })
  .catch((error) => console.log(error));
