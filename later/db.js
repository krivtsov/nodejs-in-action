const sqlite3 = require('sqlite3').verbose();

const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  const sql = `
    create table if not exists articles
      (id integer primary key, title, content TEXT)
  `;
  db.run(sql);
});

class Article {
  static all(cb) {
    db.all('SELECT * FROM articles', cb);
  }

  static find(id, cb) {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb);
  }

  static create(data, cb) {
    const sql = 'INSERT INTO articles(title, content VALUES (?, ?)';
    db.run(sql, data.title, data.content, cb);
  }
}

module.exports = db;
module.exports.Article = Article;
