const db = require('../database/db');

exports.create = (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  db.run(
    `INSERT INTO books (title, author, year) VALUES (?, ?, ?)`,
    [title, author, year],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.list = (req, res) => {
  const { page = 1, limit = 5, order = 'title', author } = req.query;

  let query = `SELECT * FROM books`;
  let params = [];

  if (author) {
    query += ` WHERE author LIKE ?`;
    params.push(`%${author}%`);
  }

  query += ` ORDER BY ${order} LIMIT ? OFFSET ?`;
  params.push(limit, (page - 1) * limit);

  db.all(query, params, (err, rows) => {
    res.json(rows);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;

  db.run(
    `UPDATE books SET title=?, author=?, year=? WHERE id=?`,
    [title, author, year, id],
    function () {
      if (this.changes === 0)
        return res.status(404).json({ error: 'Livro não encontrado' });

      res.json({ message: 'Atualizado' });
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM books WHERE id=?`, [id], function () {
    if (this.changes === 0)
      return res.status(404).json({ error: 'Livro não encontrado' });

    res.status(204).send();
  });
};
