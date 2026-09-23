const Inscricao = require('../models/Inscricao');

/**
 * Inscreve o participante em um evento com vaga disponível.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @returns {Promise<void>} Redirecionamento para os detalhes do evento.
 * @throws {Error} Erros inesperados são tratados sem expor detalhes ao usuário.
 */
async function inscrever(req, res) {
  try {
    await Inscricao.criar(req.session.usuario.id, req.params.id);
    req.session.mensagemSucesso = 'Registration completed successfully.';
  } catch (erro) {
    const mensagensEsperadas = [
      'Event not found.',
      'You are already registered for this event.',
      'No spots are available.'
    ];
    if (erro.code === 'ER_DUP_ENTRY') {
      req.session.mensagemErro = 'You are already registered for this event.';
    } else if (mensagensEsperadas.includes(erro.message)) {
      req.session.mensagemErro = erro.message;
    } else {
      console.error(erro);
      req.session.mensagemErro = 'Could not complete the registration.';
    }
  }
  res.redirect(`/eventos/${req.params.id}`);
}

/**
 * Cancela a inscrição do participante autenticado.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Redirecionamento para as inscrições do usuário.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function cancelar(req, res, next) {
  try {
    await Inscricao.cancelar(req.session.usuario.id, req.params.id);
    req.session.mensagemSucesso = 'Registration canceled.';
    res.redirect('/inscricoes/minhas');
  } catch (erro) {
    next(erro);
  }
}

/**
 * Lista as inscrições do participante autenticado.
 * @async
 * @param {import('express').Request} req Requisição HTTP.
 * @param {import('express').Response} res Resposta HTTP.
 * @param {import('express').NextFunction} next Próximo middleware.
 * @returns {Promise<void>} Página com as inscrições do usuário.
 * @throws {Error} Encaminha erros ao middleware global.
 */
async function minhas(req, res, next) {
  try {
    const inscricoes = await Inscricao.listarDoParticipante(req.session.usuario.id);
    res.render('inscricoes/minhas', { titulo: 'My registrations', inscricoes });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { inscrever, cancelar, minhas };
