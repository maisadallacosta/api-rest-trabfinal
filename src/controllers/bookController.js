const db = require('../database/db');

function isValidYear(year) {
  const currentYear = new Date().getFullYear();
  const num = Number(year);
  return Number.isInteger(num) && num > 0 && num <= currentYear + 1;
}

function sanitizeOrder(order) {
  const allowed = ['id', 'title', 'author', 'year'];
  return allowed.includes(order) ? order : 'title';
}

function sanitizeDirection(direction) {
  return String(direction).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
}

exports.create = (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  if (title.trim().length < 2) {
    return res.status(400).json({ error: 'Título inválido' });
  }

  if (author.trim().length < 2) {
    return res.status(400).json({ error: 'Autor inválido' });
  }

  if (!isValidYear(year)) {
    return res.status(400).json({ error: 'Ano inválido' });
  }

  db.run(
    `INSERT INTO books (title, author, year) VALUES (?, ?, ?)`,
    [title.trim(), author.trim(), Number(year)],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar livro' });
      }

      return res.status(201).json({
        message: 'Livro criado com sucesso',
        id: this.lastID
      });
    }
  );
};

exports.list = (req, res) => {
  const {
    page = 1,
    limit = 5,
    order = 'title',
    direction = 'ASC',
    author,
    title
  } = req.query;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const offset = (pageNum - 1) * limitNum;

  const orderBy = sanitizeOrder(order);
  const orderDirection = sanitizeDirection(direction);

  let query = `SELECT * FROM books`;
  const where = [];
  const params = [];

  if (author) {
    where.push(`author LIKE ?`);
    params.push(`%${author}%`);
  }

  if (title) {
    where.push(`title LIKE ?`);
    params.push(`%${title}%`);
  }

  if (where.length > 0) {
    query += ` WHERE ${where.join(' AND ')}`;
  }

  query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;
  params.push(limitNum, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar livros' });
    }

    db.get(`SELECT COUNT(*) AS total FROM books`, [], (countErr, countRow) => {
      if (countErr) {
        return res.status(500).json({ error: 'Erro ao contar livros' });
      }

      return res.json({
        page: pageNum,
        limit: limitNum,
        total: countRow.total,
        data: rows
      });
    });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  if (title.trim().length < 2) {
    return res.status(400).json({ error: 'Título inválido' });
  }

  if (author.trim().length < 2) {
    return res.status(400).json({ error: 'Autor inválido' });
  }

  if (!isValidYear(year)) {
    return res.status(400).json({ error: 'Ano inválido' });
  }

  db.run(
    `UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?`,
    [title.trim(), author.trim(), Number(year), id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar livro' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      return res.json({ message: 'Livro atualizado com sucesso' });
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM books WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao remover livro' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    return res.status(204).send();
  });
};
