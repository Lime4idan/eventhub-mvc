function variaveisLocais(req, res, next) {
  res.locals.usuario = req.session.usuario || null;
  res.locals.mensagemSucesso = req.session.mensagemSucesso || null;
  res.locals.mensagemErro = req.session.mensagemErro || null;

  delete req.session.mensagemSucesso;
  delete req.session.mensagemErro;
  next();
}

module.exports = variaveisLocais;
