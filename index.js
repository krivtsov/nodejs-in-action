const express = require('express');

const app = express();

const port = process.nextTick.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Express web app avaliable at http://localhost:${port}`);
});
