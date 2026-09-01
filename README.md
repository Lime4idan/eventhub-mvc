# EventHub MVC

Sistema de gestão de eventos desenvolvido com uma arquitetura MVC simples. Organizadores cadastram e administram eventos; participantes consultam os eventos e controlam suas inscrições.

## Tecnologias

- Node.js, Express, EJS e Bootstrap 5.3.8
- MySQL com `mysql2/promise`
- Sessões com `express-session`
- Senhas protegidas com `bcryptjs`
- Validação com `express-validator`
- Variáveis de ambiente com `dotenv`

## Como instalar

1. Tenha o Node.js e o MySQL instalados.
2. Entre na pasta do projeto e instale as dependências:

```bash
npm install
```

3. Execute o arquivo `database/schema.sql` no MySQL. Ele cria o banco `eventhub` e suas tabelas.
4. Copie `.env.example` para `.env` e preencha a conexão com o banco e uma `SESSION_SECRET` longa e aleatória.
5. Inicie o projeto:

```bash
npm run dev
```

A aplicação estará em `http://localhost:3000`. Para execução normal, use `npm start`.

## Variáveis de ambiente

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta usada pelo servidor. |
| `DB_HOST` | Endereço do servidor MySQL. |
| `DB_PORT` | Porta do MySQL, normalmente `3306`. |
| `DB_USER` | Usuário do banco. |
| `DB_PASSWORD` | Senha do banco. |
| `DB_NAME` | Nome do banco, normalmente `eventhub`. |
| `DB_SSL` | Use `true` quando o provedor exigir SSL. |
| `DB_SSL_REJECT_UNAUTHORIZED` | Controla a validação do servidor SSL. |
| `SESSION_SECRET` | Segredo longo usado para proteger a sessão. |
| `NODE_ENV` | Use `development` localmente e `production` no deploy. |

Os nomes também estão disponíveis no arquivo `.env.example`. Credenciais reais não devem ser enviadas ao GitHub.

## Funcionalidades

- Cadastro, login, logout e sessão com cookie `httpOnly`.
- Dois perfis: organizador e participante.
- CRUD de eventos limitado ao organizador proprietário.
- Lista de inscritos para o organizador.
- Inscrição, cancelamento e lista de inscrições do participante.
- Bloqueio de inscrição duplicada e de inscrição sem vagas.

## Arquitetura

- `config`: conexão com o banco.
- `models`: consultas SQL parametrizadas.
- `controllers`: regras das telas e ações.
- `middlewares`: autenticação, permissões e validação.
- `routes`: endereços da aplicação.
- `views`: páginas EJS.
- `public`: CSS público.
- `database`: script de criação do banco.

O Bootstrap é carregado pelo CDN oficial, e o CSS da pasta `public` adiciona a identidade visual roxo-claro do projeto.

## Deploy

O backend está pronto para o Render e usa `process.env.PORT`. No Render, configure as variáveis do `.env.example`. Para Aiven MySQL, configure host, porta, usuário, senha e banco. Se a conexão exigir SSL, use `DB_SSL=true`; a verificação do servidor fica ativa por padrão e nenhum certificado é inventado ou incluído no projeto.

Em produção, use uma `SESSION_SECRET` segura e HTTPS. O armazenamento padrão de sessões é suficiente para a atividade escolar e para uma única instância; um sistema de grande porte deve usar um armazenamento persistente de sessões.
