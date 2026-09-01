const conexao = require('../config/database');

async function listarTodos() {
  const [eventos] = await conexao.execute(`
    SELECT e.*, u.nome AS organizador_nome, COUNT(i.id) AS total_inscritos,
           (e.vagas - COUNT(i.id)) AS vagas_disponiveis
    FROM eventos e
    JOIN usuarios u ON u.id = e.organizador_id
    LEFT JOIN inscricoes i ON i.evento_id = e.id
    GROUP BY e.id, u.nome
    ORDER BY e.data_evento ASC
  `);
  return eventos;
}

async function buscarPorId(id) {
  const [eventos] = await conexao.execute(`
    SELECT e.*, u.nome AS organizador_nome, COUNT(i.id) AS total_inscritos,
           (e.vagas - COUNT(i.id)) AS vagas_disponiveis
    FROM eventos e
    JOIN usuarios u ON u.id = e.organizador_id
    LEFT JOIN inscricoes i ON i.evento_id = e.id
    WHERE e.id = ?
    GROUP BY e.id, u.nome
  `, [id]);
  return eventos[0];
}

async function criar(dados, organizadorId) {
  const [resultado] = await conexao.execute(
    `INSERT INTO eventos (titulo, descricao, data_evento, local, vagas, organizador_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [dados.titulo, dados.descricao, dados.data_evento, dados.local, dados.vagas, organizadorId]
  );
  return resultado.insertId;
}

async function atualizar(id, dados, organizadorId) {
  const [resultado] = await conexao.execute(
    `UPDATE eventos SET titulo = ?, descricao = ?, data_evento = ?, local = ?, vagas = ?
     WHERE id = ? AND organizador_id = ?`,
    [dados.titulo, dados.descricao, dados.data_evento, dados.local, dados.vagas, id, organizadorId]
  );
  return resultado.affectedRows;
}

async function excluir(id, organizadorId) {
  const [resultado] = await conexao.execute(
    'DELETE FROM eventos WHERE id = ? AND organizador_id = ?',
    [id, organizadorId]
  );
  return resultado.affectedRows;
}

async function listarDoOrganizador(organizadorId) {
  const [eventos] = await conexao.execute(`
    SELECT e.*, COUNT(i.id) AS total_inscritos
    FROM eventos e
    LEFT JOIN inscricoes i ON i.evento_id = e.id
    WHERE e.organizador_id = ?
    GROUP BY e.id
    ORDER BY e.data_evento ASC
  `, [organizadorId]);
  return eventos;
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, excluir, listarDoOrganizador };
