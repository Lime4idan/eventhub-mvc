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
    req.session.mensagemSucesso = 'Inscrição realizada com sucesso.';
  } catch (erro) {
    const mensagensEsperadas = [
      'Evento não encontrado.',
      'Você já está inscrito neste evento.',
      'Não há vagas disponíveis.'
    ];
    if (erro.code === 'ER_DUP_ENTRY') {
      req.session.mensagemErro = 'Você já está inscrito neste evento.';
    } else if (mensagensEsperadas.includes(erro.message)) {
      req.session.mensagemErro = erro.message;
    } else {
      console.error(erro);
      req.session.mensagemErro = 'Não foi possível realizar a inscrição.';
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
    req.session.mensagemSucesso = 'Inscrição cancelada.';
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
    res.render('inscricoes/minhas', { titulo: 'Minhas inscrições', inscricoes });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { inscrever, cancelar, minhas };
