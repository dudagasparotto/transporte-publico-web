const fs = require('fs');
const path = require('path');
require('../../introduca-api-nodejs/node_modules/dotenv').config({
  path: path.resolve(__dirname, '../../introduca-api-nodejs/.env'),
  override: true,
});
const db = require('../../introduca-api-nodejs/src/dataBase/connection');

const tabelas = [
  'tipo_usuarios',
  'motorista',
  'usuarios',
  'linhas',
  'rotas',
  'pontos',
  'horarios',
  'avaliacao',
  'motoristas_rotas',
];
const tabelasRemovidas = ['localizacao', 'rota_onibus', 'onibus'];

function identificador(nome) {
  return `\`${String(nome).replaceAll('`', '``')}\``;
}

async function corrigirExclusaoEmCascata() {
  const [relacoes] = await db.query(`
    SELECT
      k.TABLE_NAME AS tabela,
      k.CONSTRAINT_NAME AS restricao,
      k.COLUMN_NAME AS coluna,
      k.REFERENCED_TABLE_NAME AS tabela_referenciada,
      k.REFERENCED_COLUMN_NAME AS coluna_referenciada,
      r.DELETE_RULE AS regra
    FROM information_schema.KEY_COLUMN_USAGE k
    JOIN information_schema.REFERENTIAL_CONSTRAINTS r
      ON r.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA
     AND r.CONSTRAINT_NAME = k.CONSTRAINT_NAME
     AND r.TABLE_NAME = k.TABLE_NAME
    WHERE k.CONSTRAINT_SCHEMA = DATABASE()
      AND (
        (k.TABLE_NAME = 'pontos' AND k.REFERENCED_TABLE_NAME = 'rotas')
        OR
        (k.TABLE_NAME = 'horarios' AND k.REFERENCED_TABLE_NAME = 'pontos')
      )
  `);

  for (const relacao of relacoes) {
    if (relacao.regra === 'CASCADE') continue;

    await db.query(
      `ALTER TABLE ${identificador(relacao.tabela)}
       DROP FOREIGN KEY ${identificador(relacao.restricao)}`
    );
    await db.query(
      `ALTER TABLE ${identificador(relacao.tabela)}
       ADD CONSTRAINT ${identificador(relacao.restricao)}
       FOREIGN KEY (${identificador(relacao.coluna)})
       REFERENCES ${identificador(relacao.tabela_referenciada)}
         (${identificador(relacao.coluna_referenciada)})
       ON DELETE CASCADE
      ON UPDATE CASCADE`
    );
  }

  const [faltantes] = await db.query(`
    SELECT 'avaliacao_motorista' AS relacao
    FROM DUAL
    WHERE NOT EXISTS (
      SELECT 1
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'avaliacao'
        AND COLUMN_NAME = 'id_motorista'
        AND REFERENCED_TABLE_NAME = 'motorista'
    )
    UNION ALL
    SELECT 'avaliacao_usuario'
    FROM DUAL
    WHERE NOT EXISTS (
      SELECT 1
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'avaliacao'
        AND COLUMN_NAME = 'id_usuario'
        AND REFERENCED_TABLE_NAME = 'usuarios'
    )
    UNION ALL
    SELECT 'motoristas_rotas_motorista'
    FROM DUAL
    WHERE NOT EXISTS (
      SELECT 1
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'motoristas_rotas'
        AND COLUMN_NAME = 'id_motorista'
        AND REFERENCED_TABLE_NAME = 'motorista'
    )
  `);
  const relacoesFaltantes = new Set(faltantes.map((item) => item.relacao));

  if (relacoesFaltantes.has('avaliacao_motorista')) {
    await db.query(`
      ALTER TABLE avaliacao
      ADD CONSTRAINT fk_avaliacao_motorista
      FOREIGN KEY (id_motorista) REFERENCES motorista (id_motorista)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }
  if (relacoesFaltantes.has('avaliacao_usuario')) {
    await db.query(`
      ALTER TABLE avaliacao
      ADD CONSTRAINT fk_avaliacao_usuario
      FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }
  if (relacoesFaltantes.has('motoristas_rotas_motorista')) {
    await db.query(`
      DELETE mr
      FROM motoristas_rotas mr
      LEFT JOIN motorista m ON m.id_motorista = mr.id_motorista
      WHERE m.id_motorista IS NULL
    `);
    await db.query(`
      ALTER TABLE motoristas_rotas
      ADD CONSTRAINT fk_motoristas_rotas_motorista
      FOREIGN KEY (id_motorista) REFERENCES motorista (id_motorista)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }
}

async function gerarSql() {
  await corrigirExclusaoEmCascata();
  await db.query(`
    UPDATE avaliacao
    SET id_usuario = ELT(
      1 + MOD(id_avaliacao, 7),
      1, 2, 3, 5, 6, 21, 22
    )
    WHERE id_usuario IS NULL
  `);

  const partes = [
    '-- Banco completo utilizado pelo OminiBus',
    '-- A exclusão de rotas remove seus pontos e respectivos horários.',
    'SET NAMES utf8mb4;',
    'SET FOREIGN_KEY_CHECKS = 0;',
    '',
    '-- DELETE / DROP DE TODAS AS TABELAS',
    ...[...tabelas, ...tabelasRemovidas]
      .reverse()
      .map((tabela) => `DROP TABLE IF EXISTS ${identificador(tabela)};`),
    '',
    '-- CREATE DAS TABELAS',
  ];

  for (const tabela of tabelas) {
    const [resultado] = await db.query(
      `SHOW CREATE TABLE ${identificador(tabela)}`
    );
    partes.push(`${resultado[0]['Create Table']};`, '');
  }

  partes.push('-- INSERT DE TODOS OS DADOS UTILIZADOS');

  for (const tabela of tabelas) {
    const [linhas] = await db.query(
      `SELECT * FROM ${identificador(tabela)}`
    );

    if (linhas.length === 0) {
      partes.push(`-- ${tabela}: sem registros`, '');
      continue;
    }

    const colunas = Object.keys(linhas[0]);
    const nomesColunas = colunas.map(identificador).join(', ');
    const valores = linhas.map((linha) => {
      return `(${colunas.map((coluna) => db.escape(linha[coluna])).join(', ')})`;
    });

    partes.push(
      `INSERT INTO ${identificador(tabela)} (${nomesColunas}) VALUES`,
      `${valores.join(',\n')};`,
      ''
    );
  }

  partes.push('SET FOREIGN_KEY_CHECKS = 1;', '');

  const destino = path.resolve(
    __dirname,
    '..',
    'database',
    'banco_completo_corrigido.sql'
  );
  fs.writeFileSync(destino, partes.join('\n'), 'utf8');
  console.log(`SQL gerado em ${destino}`);
}

gerarSql()
  .then(() => db.end())
  .catch(async (erro) => {
    console.error(erro);
    await db.end();
    process.exitCode = 1;
  });
