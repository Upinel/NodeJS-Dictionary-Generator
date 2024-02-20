/*
  +----------------------------------------------------------------------+
  | NodeJS-Dictionary-Generator                                          |
  +----------------------------------------------------------------------+
  | This source file is subject to version 2.0 of the Apache license,    |
  | that is bundled with this package in the file LICENSE, and is        |
  | available through the world-wide-web at the following url:           |
  | http://www.apache.org/licenses/LICENSE-2.0.html                      |
  | If you did not receive a copy of the Apache2.0 license and are unable|
  | to obtain it through the world-wide-web, please send a note to       |
  | license@swoole.com so we can mail you a copy immediately.            |
  +----------------------------------------------------------------------+
  | Author: Nova Upinel Chow  <dev@upinel.com>                           |
  +----------------------------------------------------------------------+
*/

const fs = require('fs');
const readline = require('readline-sync'); // Using readline-sync for simplicity

const characterClasses = {
  '1': '0123456789',
  '2': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '3': 'abcdefghijklmnopqrstuvwxyz',
  '4': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '5': '0123456789abcdefghijklmnopqrstuvwxyz',
  '6': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  '7': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
};

function getCharacterClasses(choice) {
  return characterClasses[choice] || null;
};

function generateCombinations(charClasses, currentCombination, size, file) {
  if (size === 0) {
    fs.writeSync(file, `${currentCombination}\n`);
    return;
  }
  for (let char of charClasses) {
    generateCombinations(charClasses, currentCombination + char, size - 1, file);
  }
}

function generateDictionary(filename, charClasses, minSize, maxSize) {
  const fileDescriptor = fs.openSync(filename, 'w');
  for (let size = minSize; size <= maxSize; size++) {
    generateCombinations(charClasses, '', size, fileDescriptor);
  }
  fs.closeSync(fileDescriptor);
}

function main() {
  const filename = readline.question('Please enter the file name: ');
  
  let charClasses;
  while (!charClasses) {
    const choice = readline.question(
      '1) Numbers\n' +
      '2) Capital Letters\n' +
      '3) Lowercase Letters\n' +
      '4) Numbers + Capital Letters\n' +
      '5) Numbers + Lowercase Letters\n' +
      '6) Numbers + Capital Letters + Lowercase Letters\n' +
      '7) Capital Letters + Lowercase Letters\n' +
      'Please select the character class by number: '
    );
    charClasses = getCharacterClasses(choice);
    if (!charClasses) {
      console.log("Invalid choice, please try again.");
    }
  }
  
  const minSize = parseInt(readline.question("What is the min size of the word? "), 10);
  const maxSize = parseInt(readline.question("What is the max size of the word? "), 10);
  
  generateDictionary(filename, charClasses, minSize, maxSize);
  console.log(`Dictionary file '${filename}' has been created.`);
}

main();