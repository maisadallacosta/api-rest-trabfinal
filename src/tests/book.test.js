const request = require('supertest');
const app = require('../app');

describe('Books', () => {
  it('deve criar livro', async () => {
    const res = await request(app).post('/books').send({
      title: 'Teste',
      author: 'Autor',
      year: 2020
    });

    expect(res.statusCode).toBe(201);
  });
});
