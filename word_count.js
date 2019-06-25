const fs = require('fs');

const tasks = [];
const wordCounts = {};
const filesDir = './text';
let completedTasks = 0;

const checkIfComplete = () => {
  completedTasks += 1;
  if (completedTasks === tasks.length) {
    const result = Object.keys(wordCounts).map((key) => {
      const value = wordCounts[key];
      return `${key}: ${value}`;
    });
    console.log(result.join('\n'));
  }
};

const addWordCount = (word) => {
  wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
};

const countWordsInText = (text) => {
  const words = text.toString().toLowerCase().split(/\W+/).sort();
  words.filter(word => word).forEach(word => addWordCount(word));
};

fs.readdir(filesDir, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const task = (currentFile => () => {
      fs.readFile(currentFile, (er, text) => {
        if (er) throw er;
        countWordsInText(text);
        checkIfComplete();
      });
    })(`${filesDir}/${file}`);
    tasks.push(task);
  });
  tasks.forEach(task => task());
});
