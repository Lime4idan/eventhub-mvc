const conexao = require('../config/database');

async function criar(usuarioId, eventoId) {
  const banco = await conexao.getConnection();

  try {
    await banco.beginTransaction();

    const [eventos] = await banco.execute(
      'SELECT id, vagas FROM eventos WHERE id = ? FOR UPDATE',
      [eventoId]
    );
    if (!eventos[0]) throw new Error('Evento não encontrado.');

    const [existentes] = await banco.execute(
      'SELECT id FROM inscricoes WHERE usuario_id = ? AND evento_id = ?',
      [usuarioId, eventoId]
    );
    if (existentes.length > 0) throw new Error('Você já está inscrito neste evento.');

    const [quantidade] = await banco.execute(
      'SELECT COUNT(*) AS total FROM inscricoes WHERE evento_id = ?',
      [eventoId]
    );
    if (quantidade[0].total >= eventos[0].vagas) throw new Error('Não há vagas disponíveis.');

    await banco.execute(
      'INSERT INTO inscricoes (usuario_id, evento_id) VALUES (?, ?)',
      [usuarioId, eventoId]
    );
    await banco.commit();
  } catch (erro) {
    await banco.rollback();
    throw erro;
  } finally {
    banco.release();
  }
}

async function cancelar(usuarioId, eventoId) {
  const [resultado] = await conexao.execute(
    'DELETE FROM inscricoes WHERE usuario_id = ? AND evento_id = ?',
    [usuarioId, eventoId]
  );
  return resultado.affectedRows;
}

async function listarDoParticipante(usuarioId) {
  const [inscricoes] = await conexao.execute(`
    SELECT i.id, i.data_inscricao, e.id AS evento_id, e.titulo, e.data_evento, e.local
    FROM inscricoes i
    JOIN eventos e ON e.id = i.evento_id
    WHERE i.usuario_id = ?
    ORDER BY e.data_evento ASC
  `, [usuarioId]);
  return inscricoes;
}

async function listarInscritos(eventoId, organizadorId) {
  const [inscritos] = await conexao.execute(`
    SELECT u.id, u.nome, u.email, i.data_inscricao
    FROM inscricoes i
    JOIN usuarios u ON u.id = i.usuario_id
    JOIN eventos e ON e.id = i.evento_id
    WHERE i.evento_id = ? AND e.organizador_id = ?
    ORDER BY i.data_inscricao ASC
  `, [eventoId, organizadorId]);
  return inscritos;
}

async function estaInscrito(usuarioId, eventoId) {
  const [inscricoes] = await conexao.execute(
    'SELECT id FROM inscricoes WHERE usuario_id = ? AND evento_id = ?',
    [usuarioId, eventoId]
  );
  return inscricoes.length > 0;
}

module.exports = { criar, cancelar, listarDoParticipante, listarInscritos, estaInscrito };
