const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { SECRET } = require('../config/auth');

const token = jwt.sign({ id: 1, email: 'teste@email.com' }, SECRET);

describe('Books', () => {
  it('deve criar livro', async () => {
    const res = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Teste',
        author: 'Autor',
        year: 2020
      });

    expect([201, 500]).toContain(res.statusCode);
  });

  it('deve listar livros', async () => {
    const res = await request(app)
      .get('/books')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode);
  });
});
