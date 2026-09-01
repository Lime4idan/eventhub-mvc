const express = require('express');
const eventoController = require('../controllers/eventoController');
const { exigirLogin, exigirOrganizador } = require('../middlewares/autenticacao');
const { validarEvento } = require('../middlewares/validacoes');

const router = express.Router();

router.use(exigirLogin);
router.get('/', eventoController.listar);
router.get('/novo', exigirOrganizador, eventoController.mostrarNovo);
router.post('/', exigirOrganizador, validarEvento, eventoController.criar);
router.get('/:id', eventoController.detalhar);
router.get('/:id/editar', exigirOrganizador, eventoController.mostrarEdicao);
router.post('/:id/editar', exigirOrganizador, validarEvento, eventoController.atualizar);
router.post('/:id/excluir', exigirOrganizador, eventoController.excluir);
router.get('/:id/inscritos', exigirOrganizador, eventoController.verInscritos);

module.exports = router;
