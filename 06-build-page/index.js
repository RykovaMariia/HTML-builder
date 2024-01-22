const fsp = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const pathFolderDist = path.join(__dirname, 'project-dist');
    const pathFolderDistAssets = path.join(__dirname, 'project-dist', 'assets');

    await checkExistAndRemove(pathFolderDist);
    await fsp.mkdir(pathFolderDist, { recursive: true });
    await createAssetsAndCopy(pathFolderDistAssets);
    await createStyleAndMerge();
    await mergeHTML();
  } catch (err) {
    console.log(err);
  }
})();

async function checkExistAndRemove(pathFolder) {
  try {
    const isFolderDistExists = await fsp
      .access(pathFolder)
      .then(() => true)
      .catch(() => false);

    if (isFolderDistExists) {
      await fsp.rm(pathFolder, { recursive: true }, { force: true });
    }
  } catch (err) {
    console.log(err);
  }
}

async function createAssetsAndCopy(pathFolderDistAssets) {
  try {
    const pathFolderAssets = path.join(__dirname, 'assets');

    await checkExistAndRemove(pathFolderDistAssets);
    await fsp.mkdir(pathFolderDistAssets, { recursive: true });
    await copyAssets(pathFolderAssets, pathFolderDistAssets);
  } catch (err) {
    console.log(err);
  }
}

async function copyAssets(pathFolder, pathFolderCopy) {
  try {
    const filesFolder = await fsp.readdir(pathFolder, { withFileTypes: true });

    for (let file of filesFolder) {
      const pathFile = path.join(pathFolder, file.name);
      const pathFileCopy = path.join(pathFolderCopy, file.name);

      if (file.isFile()) {
        await fsp.copyFile(pathFile, pathFileCopy);
      } else if (file.isDirectory()) {
        await fsp.mkdir(path.join(pathFolderCopy, file.name), {
          recursive: true,
        });
        await copyAssets(
          path.join(pathFolder, file.name),
          path.join(pathFolderCopy, file.name),
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function createStyleAndMerge() {
  try {
    const pathFileDistStyle = path.join(__dirname, 'project-dist', 'style.css');
    await checkExistAndRemove(pathFileDistStyle);
    await mergeStyle(pathFileDistStyle);
  } catch (err) {
    console.log(err);
  }
}

async function mergeStyle(pathFileDistStyle) {
  try {
    const pathFolderStyles = path.join(__dirname, 'styles');
    const filesStyle = await fsp.readdir(pathFolderStyles, {
      withFileTypes: true,
    });

    for (let file of filesStyle) {
      const pathFile = path.join(pathFolderStyles, file.name);
      const fileExt = path.extname(pathFile);

      if (file.isFile() && fileExt === '.css') {
        const dataFile = await fsp.readFile(pathFile, 'utf-8');
        await fsp.appendFile(pathFileDistStyle, dataFile);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function mergeHTML() {
  try {
    let pathFileDistHTML = path.join(__dirname, 'project-dist', 'index.html');
    let pathHTML = path.join(__dirname, 'template.html');
    let pathComponents = path.join(__dirname, 'components');

    await checkExistAndRemove(pathFileDistHTML);

    let data = await fsp.readFile(pathHTML, { encoding: 'utf8' });

    const components = await fsp.readdir(pathComponents, {
      withFileTypes: true,
    });

    for (let component of components) {
      const pathComponent = path.join(pathComponents, component.name);
      const componentExt = path.extname(pathComponent);

      if (component.isFile() && componentExt === '.html') {
        const componentName = component.name.split('.')[0];
        const componentData = await fsp.readFile(pathComponent, 'utf-8');
        data = data.replace(`{{${componentName}}}`, componentData);
        await fsp.writeFile(pathFileDistHTML, data);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
