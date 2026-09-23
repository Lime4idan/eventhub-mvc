const Evento = require('../models/Evento');
const Inscricao = require('../models/Inscricao');
const { obterErros } = require('../middlewares/validacoes');

/**
 * Lista os eventos permitidos para o usuário da sessão.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Página com a lista de eventos.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function listar(req, res, next) {
  try {
    const eventos = req.session.usuario.tipo === 'organizador'
      ? await Evento.listarDoOrganizador(req.session.usuario.id)
      : await Evento.listarTodos();
    res.render('eventos/lista', { titulo: 'Eventos', eventos });
  } catch (erro) {
    next(erro);
  }
}

function mostrarNovo(req, res) {
  res.render('eventos/formulario', { titulo: 'New event', evento: {}, erros: [], acao: '/eventos' });
}

/**
 * Cria um evento para o organizador autenticado.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Renderização ou redirecionamento da página.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function criar(req, res, next) {
  try {
    const erros = obterErros(req);
    if (erros.length > 0) {
      return res.status(422).render('eventos/formulario', {
        titulo: 'New event', evento: req.body, erros, acao: '/eventos'
      });
    }
    await Evento.criar(req.body, req.session.usuario.id);
    req.session.mensagemSucesso = 'Event created successfully.';
    res.redirect('/eventos');
  } catch (erro) {
    next(erro);
  }
}

/**
 * Exibe os detalhes de um evento.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Página de detalhes do evento.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function detalhar(req, res, next) {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) return res.status(404).render('erro', { titulo: 'Not found', mensagem: 'Event not found.' });

    let inscrito = false;
    if (req.session.usuario.tipo === 'participante') {
      inscrito = await Inscricao.estaInscrito(req.session.usuario.id, req.params.id);
    }
    res.render('eventos/detalhes', { titulo: evento.titulo, evento, inscrito });
  } catch (erro) {
    next(erro);
  }
}

async function mostrarEdicao(req, res, next) {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento || evento.organizador_id !== req.session.usuario.id) {
      return res.status(404).render('erro', { titulo: 'Not found', mensagem: 'Event not found or not owned by you.' });
    }
    res.render('eventos/formulario', {
      titulo: 'Edit event', evento, erros: [], acao: `/eventos/${evento.id}/editar`
    });
  } catch (erro) {
    next(erro);
  }
}

/**
 * Atualiza um evento pertencente ao organizador autenticado.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Renderização ou redirecionamento da página.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function atualizar(req, res, next) {
  try {
    const erros = obterErros(req);
    if (erros.length > 0) {
      return res.status(422).render('eventos/formulario', {
        titulo: 'Edit event', evento: { ...req.body, id: req.params.id }, erros,
        acao: `/eventos/${req.params.id}/editar`
      });
    }
    const alterados = await Evento.atualizar(req.params.id, req.body, req.session.usuario.id);
    if (!alterados) return res.status(404).render('erro', { titulo: 'Not found', mensagem: 'Event not found or not owned by you.' });
    req.session.mensagemSucesso = 'Event updated successfully.';
    res.redirect('/eventos');
  } catch (erro) {
    next(erro);
  }
}

/**
 * Exclui um evento pertencente ao organizador autenticado.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Redirecionamento para a lista de eventos.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function excluir(req, res, next) {
  try {
    const excluidos = await Evento.excluir(req.params.id, req.session.usuario.id);
    req.session[excluidos ? 'mensagemSucesso' : 'mensagemErro'] = excluidos
      ? 'Event deleted successfully.'
      : 'Event not found or not owned by you.';
    res.redirect('/eventos');
  } catch (erro) {
    next(erro);
  }
}

/**
 * Lista os participantes inscritos em um evento do organizador.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Página com as pessoas inscritas.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function verInscritos(req, res, next) {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento || evento.organizador_id !== req.session.usuario.id) {
      return res.status(404).render('erro', { titulo: 'Not found', mensagem: 'Event not found or not owned by you.' });
    }
    const inscritos = await Inscricao.listarInscritos(req.params.id, req.session.usuario.id);
    res.render('eventos/inscritos', { titulo: 'Registered attendees', evento, inscritos });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, mostrarNovo, criar, detalhar, mostrarEdicao, atualizar, excluir, verInscritos };
