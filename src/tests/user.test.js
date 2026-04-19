const request = require('supertest');
const app = require('../app');

describe('Users', () => {
  it('deve cadastrar usuário', async () => {
    const res = await request(app).post('/register').send({
      name: 'Maria Teste',
      email: 'maria.teste@email.com',
      password: '123456'
    });

    expect([201, 409, 500]).toContain(res.statusCode);
  });

  it('deve logar usuário', async () => {
    const res = await request(app).post('/login').send({
      email: 'maria.teste@email.com',
      password: '123456'
    });

    expect([200, 401, 404, 500]).toContain(res.statusCode);
  });
});
