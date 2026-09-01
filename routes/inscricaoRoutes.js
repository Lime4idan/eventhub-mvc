const express = require('express');
const inscricaoController = require('../controllers/inscricaoController');
const { exigirLogin, exigirParticipante } = require('../middlewares/autenticacao');

const router = express.Router();

router.use(exigirLogin, exigirParticipante);
router.get('/inscricoes/minhas', inscricaoController.minhas);
router.post('/eventos/:id/inscrever', inscricaoController.inscrever);
router.post('/eventos/:id/cancelar', inscricaoController.cancelar);

module.exports = router;
