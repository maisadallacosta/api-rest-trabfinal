const db = require('../database/db');

exports.create = (req, res) => {
  const { user_id, book_id } = req.body;

  if (!user_id || !book_id) {
    return res.status(400).json({ error: 'user_id e book_id são obrigatórios' });
  }

  const userId = Number(user_id);
  const bookId = Number(book_id);

  if (!Number.isInteger(userId) || !Number.isInteger(bookId)) {
    return res.status(400).json({ error: 'IDs inválidos' });
  }

  db.get(`SELECT id FROM users WHERE id = ?`, [userId], (userErr, user) => {
    if (userErr) {
      return res.status(500).json({ error: 'Erro ao validar usuário' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    db.get(`SELECT id FROM books WHERE id = ?`, [bookId], (bookErr, book) => {
      if (bookErr) {
        return res.status(500).json({ error: 'Erro ao validar livro' });
      }

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      db.run(
        `INSERT INTO loans (user_id, book_id, loan_date)
         VALUES (?, ?, datetime('now'))`,
        [userId, bookId],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Erro ao criar empréstimo' });
          }

          return res.status(201).json({
            message: 'Empréstimo criado com sucesso',
            id: this.lastID
          });
        }
      );
    });
  });
};

exports.list = (req, res) => {
  db.all(
    `
    SELECT loans.id, users.name AS user_name, users.email, books.title AS book_title, books.author, loans.loan_date
    FROM loans
    JOIN users ON users.id = loans.user_id
    JOIN books ON books.id = loans.book_id
    ORDER BY loans.id DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao listar empréstimos' });
      }

      return res.json(rows);
    }
  );
};
