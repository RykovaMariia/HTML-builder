const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const textFile = 'text.txt';
const pathFile = path.join(__dirname, textFile);

stdout.write('Hi, please, input text\n');
fs.writeFile(pathFile, '', () => {});

const output = fs.createWriteStream(pathFile);

stdin.on('data', (text) => {
  if (text.toString() == 'exit\n') {
    stdout.write('\n Goodbye \n');
    exit();
  }
  output.write(text);

  process.on('SIGINT', () => {
    stdout.write('\nGoodbye \n');
    exit();
  });
});
