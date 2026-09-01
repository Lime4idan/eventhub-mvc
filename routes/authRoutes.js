const express = require('express');
const authController = require('../controllers/authController');
const { validarCadastro, validarLogin } = require('../middlewares/validacoes');

const router = express.Router();

router.get('/cadastro', authController.mostrarCadastro);
router.post('/cadastro', validarCadastro, authController.cadastrar);
router.get('/login', authController.mostrarLogin);
router.post('/login', validarLogin, authController.entrar);
router.post('/logout', authController.sair);

module.exports = router;
