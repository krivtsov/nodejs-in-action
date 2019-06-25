/* eslint-disable no-use-before-define */
const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');

const configFilename = './text/rss_feads.txt';

const checkForRSSFile = () => {
  fs.exists(configFilename, (exists) => {
    if (!exists) return next(new Error(`Missing RSS file: ${configFilename}`));
    return next(null, configFilename);
  });
};

const readRSSFile = (filePath) => {
  fs.readFile(filePath, (err, feedlist) => {
    if (err) return next(err);
    const feedListString = feedlist.toString().replace(/^\s+$/g, '').split('\n');
    const random = Math.floor(Math.random() * feedListString.length);
    const feed = feedListString[random];
    return next(null, feed);
  });
};

const domwloadRSSFeed = (feedUrl) => {
  request({ url: feedUrl }, (err, res, body) => {
    if (err) return next(err);
    if (res.statusCode !== 200) return next(new Error('Abnormal response Status code'));
    return next(null, body);
  });
};

const parseRSSFeed = (rss) => {
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length) return next(new Error('No Rss items found'));
  const item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
  return item;
};

const tasks = [
  checkForRSSFile,
  readRSSFile,
  domwloadRSSFeed,
  parseRSSFeed,
];

const next = (err, result) => {
  if (err) throw err;
  const currentTask = tasks.shift();
  if (currentTask) currentTask(result);
};

next();
