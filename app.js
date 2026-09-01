require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');
const variaveisLocais = require('./middlewares/variaveisLocais');

const app = express();
const porta = process.env.PORT || 3000;
const segredoSessao = process.env.SESSION_SECRET;

if (process.env.NODE_ENV === 'production' && !segredoSessao) {
  throw new Error('SESSION_SECRET deve ser configurada em produção.');
}

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'eventhub.sid',
  secret: segredoSessao || 'segredo-usado-apenas-em-desenvolvimento',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 4
  }
}));
app.use(variaveisLocais);

app.get('/', (req, res) => res.redirect(req.session.usuario ? '/eventos' : '/login'));
app.use(authRoutes);
app.use('/eventos', eventoRoutes);
app.use(inscricaoRoutes);

app.use((req, res) => {
  res.status(404).render('erro', { titulo: 'Página não encontrada', mensagem: 'A página solicitada não existe.' });
});

app.use((erro, req, res, next) => {
  console.error(erro);
  const mensagem = process.env.NODE_ENV === 'production'
    ? 'Ocorreu um erro interno. Tente novamente.'
    : erro.message;
  res.status(500).render('erro', { titulo: 'Erro', mensagem });
});

if (require.main === module) {
  app.listen(porta, () => console.log(`EventHub disponível em http://localhost:${porta}`));
}

module.exports = app;
