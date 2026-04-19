const db = require('./src/database/db');

db.serialize(() => {
  db.run(`DELETE FROM loans`);
  db.run(`DELETE FROM books`);

  for (let i = 1; i <= 20; i++) {
    db.run(
      `INSERT INTO books (title, author, year) VALUES (?, ?, ?)`,
      [`Livro ${i}`, `Autor ${i}`, 2000 + i],
      (err) => {
        if (err) {
          console.log('Erro ao inserir:', err.message);
        } else {
          console.log(`Livro ${i} inserido`);
        }
      }
    );
  }
});

// como rodar ??
// no terminal: node seeds.js