const fsp = require('fs/promises');
const path = require('path');

let pathFolderAssets = path.join(__dirname, 'assets');
let pathFolderStyles = path.join(__dirname, 'styles');
let pathHTML = path.join(__dirname, 'template.html');
let pathComponents = path.join(__dirname, 'components');

let pathFolderDist = path.join(__dirname, 'project-dist');
let pathFolderDistAssets = path.join(__dirname, 'project-dist', 'assets');
let pathFileDistStyle = path.join(__dirname, 'project-dist', 'style.css');
let pathFileDistHTML = path.join(__dirname, 'project-dist', 'index.html');

(async () => {
  await checkExistAndRemove(pathFolderDist);
  await fsp
    .mkdir(pathFolderDist, { recursive: true })
    .then(() => {
      createAssetsAndCopy(pathFolderDistAssets);
      createStyleAndMerge();
      mergeHTML();
    })
    .catch((error) => console.log(error));
})();

async function checkExistAndRemove(pathFolderDist) {
  const isFolderDistExists = await fsp
    .access(pathFolderDist)
    .then(() => true)
    .catch(() => false);

  if (isFolderDistExists) {
    await fsp
      .rm(pathFolderDist, { recursive: true }, { force: true })
      .then(() => {})
      .catch((error) => console.log(error));
  }
}

async function createAssetsAndCopy() {
  await checkExistAndRemove(pathFolderDistAssets);
  await fsp
    .mkdir(pathFolderDistAssets, { recursive: true })
    .then(() => {
      copyAssets(pathFolderAssets, pathFolderDistAssets);
    })
    .catch((error) => console.log(error));
}

async function copyAssets(pathFolder, pathFolderCopy) {
  let data = await fsp.readdir(pathFolder, {
    withFileTypes: true,
  });

  for (let file of data) {
    const pathFile = path.join(pathFolder, file.name);
    const pathFileCopy = path.join(pathFolderCopy, file.name);

    if (file.isFile()) {
      await fsp.copyFile(pathFile, pathFileCopy).then(() => {});
    } else if (file.isDirectory()) {
      fsp
        .mkdir(path.join(pathFolderCopy, file.name), { recursive: true })
        .then(() => {
          copyAssets(
            path.join(pathFolder, file.name),
            path.join(pathFolderCopy, file.name),
          );
        })
        .catch((error) => console.log(error));
    }
  }
}

async function createStyleAndMerge() {
  await checkExistAndRemove(pathFileDistStyle);
  await mergeStyle();
}

async function mergeStyle() {
  await fsp.readdir(pathFolderStyles, { withFileTypes: true }).then((data) => {
    for (let file of data) {
      const pathFile = path.join(pathFolderStyles, file.name);
      const fileExt = path.extname(pathFile);

      if (file.isFile() && fileExt === '.css') {
        fsp.readFile(pathFile, 'utf-8').then((dataFile) => {
          fsp.appendFile(pathFileDistStyle, dataFile);
        });
      }
    }
  });
}

async function mergeHTML() {
  checkExistAndRemove(pathFileDistHTML);
  const data = await fsp.readFile(pathHTML, { encoding: 'utf8' });
  let dataHTML = data;

  const components = await fsp.readdir(pathComponents, { withFileTypes: true });

  for (let component of components) {
    const pathComponent = path.join(pathComponents, component.name);
    const componentExt = path.extname(pathComponent);

    if (component.isFile() && componentExt === '.html') {
      const componentName = component.name.split('.')[0];
      const componentData = await fsp.readFile(pathComponent, 'utf-8');
      dataHTML = dataHTML.replace(`{{${componentName}}}`, componentData);
      await fsp.writeFile(pathFileDistHTML, dataHTML);
    }
  }
}
