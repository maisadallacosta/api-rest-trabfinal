const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET, TOKEN_EXPIRES_IN } = require('../config/auth');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (name.trim().length < 3) {
    return res.status(400).json({ error: 'Nome deve ter ao menos 3 caracteres' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
  }

  const hash = bcrypt.hashSync(password, 8);

  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name.trim(), email.toLowerCase().trim(), hash],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Email já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
      }

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        id: this.lastID
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email.toLowerCase().trim()],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao realizar login' });
      }

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const valid = bcrypt.compareSync(password, user.password);

      if (!valid) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET,
        { expiresIn: TOKEN_EXPIRES_IN }
      );

      return res.json({
        message: 'Login realizado com sucesso',
        token
      });
    }
  );
};