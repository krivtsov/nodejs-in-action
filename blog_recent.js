/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');

const port = 8001;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('./titles.json', (err1, dataJson) => {
      if (err1) {
        console.error(err1);
        res.end('Server Error');
      } else {
        const titles = JSON.parse(dataJson.toString());
        fs.readFile('./template.html', (err2, dataHtml) => {
          if (err2) {
            console.error(err2);
            res.end('Server Error');
          } else {
            const tmpl = dataHtml.toString();
            const html = tmpl.replace('%', titles.join('</li><li>'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
          }
        });
      }
    });
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Express starting on  ${port} http://localhost:${port} press ctrl + C for Exit`);
});

module.exports = server;
