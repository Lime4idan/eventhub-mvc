const { body, validationResult } = require('express-validator');

const validarCadastro = [
  body('nome').trim().isLength({ min: 3 }).withMessage('Enter a name with at least 3 characters.'),
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters.'),
  body('tipo').isIn(['organizador', 'participante']).withMessage('Select a valid account type.')
];

const validarLogin = [
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('senha').notEmpty().withMessage('Enter your password.')
];

const validarEvento = [
  body('titulo').trim().isLength({ min: 3, max: 150 }).withMessage('Enter a valid title.'),
  body('descricao').trim().isLength({ min: 10 }).withMessage('Description must contain at least 10 characters.'),
  body('data_evento').isISO8601().withMessage('Enter a valid date.'),
  body('local').trim().notEmpty().withMessage('Enter a location.'),
  body('vagas').isInt({ min: 1 }).withMessage('The event must offer at least one spot.')
];

function obterErros(req) {
  return validationResult(req).array();
}

module.exports = { validarCadastro, validarLogin, validarEvento, obterErros };
