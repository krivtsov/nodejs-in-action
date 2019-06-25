/* eslint-disable consistent-return */
const express = require('express');
const bodyParser = require('body-parser');
const read = require('node-readability');
const { Article } = require('./db');

const app = express();

// const articles = [{ title: 'Example' }];

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extented: true }));
app.use(
  '/css/bootstrap.css',
  express.static('../node_modules/bootstrap/dist/css/bootstrap.css'),
);

app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err);
    res.format({
      html: () => {
        res.render('../later/views/articles.ejs', { articles });
      },
      json: () => {
        res.send(articles);
      },
    });
  });
});

app.post('/articles', (req, res, next) => {
  const { url } = req.body;

  read(url, (err, result) => {
    if (err || !result) res.status(500).send('Error downloading article');
    Article.create(
      { title: result.title, content: result.content },
      (er, article) => {
        if (er) return next(er);
        console.log(article);
        res.send('OK');
      },
    );
  });
});

app.get('/articles/:id', (req, res, next) => {
  const { id } = req.params;
  Article.find(id, (err, article) => {
    if (err) return next(err);
    res.format({
      html: () => {
        res.render('../later/views/article.ejs', { article });
      },
      json: () => {
        res.send(article);
      },
    });
  });
});

app.delete('/articles/:id', (req, res, next) => {
  const { id } = req.params;
  Article.delete(id, (err) => {
    if (err) return next(err);
    res.send({ message: 'Deleted' });
  });
});

app.listen((port), () => {
  console.log(`Express web app avaliable at http://localhost:${port}`, (port));
});

module.exports = app;
