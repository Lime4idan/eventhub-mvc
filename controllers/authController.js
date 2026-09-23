const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { obterErros } = require('../middlewares/validacoes');

function mostrarCadastro(req, res) {
  res.render('auth/cadastro', { titulo: 'Register', erros: [], dados: {} });
}

/**
 * Cadastra um usuário com a senha protegida.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Renderização ou redirecionamento da página.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function cadastrar(req, res, next) {
  try {
    const erros = obterErros(req);
    if (erros.length > 0) {
      return res.status(422).render('auth/cadastro', {
        titulo: 'Register', erros, dados: req.body
      });
    }

    const usuarioExistente = await Usuario.buscarPorEmail(req.body.email);
    if (usuarioExistente) {
      return res.status(409).render('auth/cadastro', {
        titulo: 'Register',
        erros: [{ msg: 'This email address is already registered.' }],
        dados: req.body
      });
    }

    const senhaProtegida = await bcrypt.hash(req.body.senha, 10);
    await Usuario.criar(req.body.nome, req.body.email, senhaProtegida, req.body.tipo);
    req.session.mensagemSucesso = 'Account created. You can now sign in.';
    res.redirect('/login');
  } catch (erro) {
    next(erro);
  }
}

function mostrarLogin(req, res) {
  res.render('auth/login', { titulo: 'Login', erros: [], dados: {} });
}

/**
 * Autentica o usuário e inicia a sessão.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Renderização ou redirecionamento da página.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function entrar(req, res, next) {
  try {
    const erros = obterErros(req);
    if (erros.length > 0) {
      return res.status(422).render('auth/login', { titulo: 'Login', erros, dados: req.body });
    }

    const usuario = await Usuario.buscarPorEmail(req.body.email);
    const senhaCorreta = usuario && await bcrypt.compare(req.body.senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).render('auth/login', {
        titulo: 'Login', erros: [{ msg: 'Incorrect email address or password.' }], dados: req.body
      });
    }

    req.session.regenerate((erro) => {
      if (erro) return next(erro);
      req.session.usuario = {
        id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo
      };
      res.redirect('/eventos');
    });
  } catch (erro) {
    next(erro);
  }
}

function sair(req, res, next) {
  req.session.destroy((erro) => {
    if (erro) return next(erro);
    res.clearCookie('eventhub.sid');
    res.redirect('/login');
  });
}

module.exports = { mostrarCadastro, cadastrar, mostrarLogin, entrar, sair };
