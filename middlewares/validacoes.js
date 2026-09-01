const { body, validationResult } = require('express-validator');

const validarCadastro = [
  body('nome').trim().isLength({ min: 3 }).withMessage('Informe um nome com pelo menos 3 letras.'),
  body('email').isEmail().withMessage('Informe um e-mail válido.').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
  body('tipo').isIn(['organizador', 'participante']).withMessage('Selecione um tipo válido.')
];

const validarLogin = [
  body('email').isEmail().withMessage('Informe um e-mail válido.').normalizeEmail(),
  body('senha').notEmpty().withMessage('Informe a senha.')
];

const validarEvento = [
  body('titulo').trim().isLength({ min: 3, max: 150 }).withMessage('Informe um título válido.'),
  body('descricao').trim().isLength({ min: 10 }).withMessage('A descrição deve ter pelo menos 10 caracteres.'),
  body('data_evento').isISO8601().withMessage('Informe uma data válida.'),
  body('local').trim().notEmpty().withMessage('Informe o local.'),
  body('vagas').isInt({ min: 1 }).withMessage('O evento deve ter pelo menos uma vaga.')
];

function obterErros(req) {
  return validationResult(req).array();
}

module.exports = { validarCadastro, validarLogin, validarEvento, obterErros };
