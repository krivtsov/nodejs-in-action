/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');

const port = 8000;

const formatHTML = (titles, tmpl, res) => {
  const html = tmpl.replace('%', titles.join('</li><li>'));
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
};

const hadError = (err, res) => {
  console.error(err);
  res.end('Server error');
};

const getTemplate = (titles, res) => {
  fs.readFile('./template.html', (err, data) => {
    if (err) {
      hadError(err, res);
    } else {
      const tmpl = data.toString();
      formatHTML(titles, tmpl, res);
    }
  });
};

const getTitles = (res) => {
  fs.readFile('./titles.json', (err, data) => {
    if (err) {
      hadError(err, res);
    } else {
      const titles = JSON.parse(data.toString());
      getTemplate(titles, res);
    }
  });
};

const server = http.createServer((req, res) => getTitles(res)).listen(port, '127.0.0.1', () => {
  console.log(`Express starting on  ${port} http://localhost:${port} press ctrl + C for Exit`);
});

module.exports = server;
