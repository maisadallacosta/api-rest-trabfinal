const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');
const book = require('../controllers/bookController');
const loan = require('../controllers/loanController');
const auth = require('../middlewares/auth');

router.post('/register', user.register);
router.post('/login', user.login);

router.post('/books', auth, book.create);
router.get('/books', auth, book.list);
router.put('/books/:id', auth, book.update);
router.delete('/books/:id', auth, book.delete);

router.post('/loans', auth, loan.create);
router.get('/loans', auth, loan.list);

module.exports = router;
