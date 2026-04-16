const db = require('./src/database/db');

for (let i = 1; i <= 20; i++) {
  db.run(
    `INSERT INTO books (title, author, year) VALUES (?, ?, ?)`,
    [`Livro ${i}`, `Autor ${i}`, 2000 + i],
    (err) => {
      if (err) {
        console.log('Erro:', err);
      } else {
        console.log(`Livro ${i} inserido`);
      }
    }
  );
}
