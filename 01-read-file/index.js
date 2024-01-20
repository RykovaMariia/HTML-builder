const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');
const input = fs.createReadStream(pathFile, 'utf-8');

input.on('data', (chunk) => {
  console.log(chunk);
});
