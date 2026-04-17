# API REST - Sistema de Biblioteca

Este projeto consiste em uma API REST desenvolvida com Node.js, Express e SQLite para gerenciamento de usuários, livros e empréstimos. A aplicação implementa autenticação com JWT, operações CRUD completas, validações robustas, filtros, ordenação, paginação e testes automatizados.

---

## Tecnologias Utilizadas

- Node.js
- Express
- SQLite3
- bcryptjs
- jsonwebtoken
- Jest
- Supertest
- Nodemon

---

## Estrutura do Projeto

```

src/
config/
auth.js
controllers/
bookController.js
userController.js
loanController.js
database/
db.js
middleware/
auth.js
routes/
index.js
tests/
book.test.js
user.test.js
app.js
server.js

seeds.js
package.json
README.md
postman.json

```

---

## Instalação e Execução

### 1. Clonar o projeto

```

git clone <url-do-repositorio>
cd api-rest

```

### 2. Instalar dependências

```

npm install

```

### 3. Popular o banco

```

node seeds.js

```

### 4. Rodar o servidor

```

npm run dev

```

ou

```

npm start

```

A API estará disponível em:

```

[http://localhost:3000](http://localhost:3000)

```

---

## Autenticação

A API utiliza autenticação com JWT.

Fluxo obrigatório:

1. Registrar usuário
2. Fazer login
3. Utilizar token nas rotas protegidas

---

## Uso no Postman

### Registrar usuário

POST /register

```

{
"name": "Usuario Teste",
"email": "[usuario@email.com](mailto:usuario@email.com)",
"password": "123456"
}

```

### Login

POST /login

```

{
"email": "[usuario@email.com](mailto:usuario@email.com)",
"password": "123456"
}

```

Resposta:

```

{
"token": "SEU_TOKEN_AQUI"
}

```

### Header obrigatório

```

Authorization: Bearer SEU_TOKEN_AQUI

```

---

## Rotas

### Usuários

- POST /register
- POST /login

### Livros

- POST /books
- GET /books
- PUT /books/:id
- DELETE /books/:id

### Filtros, ordenação e paginação

Exemplo:

```

/books?page=1&limit=5&order=title&direction=ASC&author=Autor

```

Parâmetros:

- page
- limit
- order (id, title, author, year)
- direction (ASC, DESC)
- author
- title

### Empréstimos

- POST /loans
- GET /loans

Retorna:

- nome do usuário
- email
- título do livro
- autor
- data do empréstimo

---

## Exemplos

### Criar livro

```

{
"title": "Dom Casmurro",
"author": "Machado de Assis",
"year": 1899
}

```

### Criar empréstimo

```

{
"user_id": 1,
"book_id": 1
}

```

---

## Validações

- Campos obrigatórios
- Email válido
- Senha mínima de 6 caracteres
- Ano válido
- Verificação de existência de usuário e livro
- Email único

---

## Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

---

## Banco de Dados

Arquivo:

```

database.sqlite

```

Tabelas:

- users
- books
- loans

---

## Seed

```

node seeds.js

```

Insere automaticamente 20 livros.

---

## Testes

```

npm test

```

---

## Collection Postman

Arquivo:

```

postman_collection.json

```

Importar no Postman.

---

## Deploy

### Render / Railway

Build:

```

npm install

```

Start:

```

npm start

```

Configuração de porta:

```

const PORT = process.env.PORT || 3000;

```

---

## Problemas Comuns

Token não fornecido:

Adicionar header Authorization

Token inválido:

Verificar formato:

```

Bearer TOKEN

```

Erro de rota:

Servidor não iniciado

Erro no banco:

```

node seeds.js

```