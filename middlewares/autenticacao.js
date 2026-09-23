function exigirLogin(req, res, next) {
  if (!req.session.usuario) {
    req.session.mensagemErro = 'Sign in to continue.';
    return res.redirect('/login');
  }
  next();
}

function exigirOrganizador(req, res, next) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'organizador') {
    req.session.mensagemErro = 'This area is available to organizers only.';
    return res.redirect('/eventos');
  }
  next();
}

function exigirParticipante(req, res, next) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'participante') {
    req.session.mensagemErro = 'This area is available to attendees only.';
    return res.redirect('/eventos');
  }
  next();
}

module.exports = { exigirLogin, exigirOrganizador, exigirParticipante };
