const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'segredo';

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || password.length < 6) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const hash = bcrypt.hashSync(password, 8);

  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hash],
    function (err) {
      if (err) return res.status(400).json({ error: 'Email já existe' });

      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id }, SECRET);

    res.json({ token });
  });
};
