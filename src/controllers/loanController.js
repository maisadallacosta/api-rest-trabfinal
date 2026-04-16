const db = require('../database/db');

exports.create = (req, res) => {
  const { user_id, book_id } = req.body;

  db.run(
    `INSERT INTO loans (user_id, book_id, loan_date)
     VALUES (?, ?, datetime('now'))`,
    [user_id, book_id],
    function () {
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.list = (req, res) => {
  db.all(`
    SELECT loans.id, users.name, books.title, loan_date
    FROM loans
    JOIN users ON users.id = loans.user_id
    JOIN books ON books.id = loans.book_id
  `, [], (err, rows) => {
    res.json(rows);
  });
};
