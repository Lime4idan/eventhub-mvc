function exigirLogin(req, res, next) {
  if (!req.session.usuario) {
    req.session.mensagemErro = 'Faça login para continuar.';
    return res.redirect('/login');
  }
  next();
}

function exigirOrganizador(req, res, next) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'organizador') {
    req.session.mensagemErro = 'Acesso permitido apenas para organizadores.';
    return res.redirect('/eventos');
  }
  next();
}

function exigirParticipante(req, res, next) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'participante') {
    req.session.mensagemErro = 'Acesso permitido apenas para participantes.';
    return res.redirect('/eventos');
  }
  next();
}

module.exports = { exigirLogin, exigirOrganizador, exigirParticipante };
