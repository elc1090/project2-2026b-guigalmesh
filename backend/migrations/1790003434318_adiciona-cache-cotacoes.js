/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // 1. Adicionando cache em tempo real na tabela de ativos
  pgm.sql(`
    ALTER TABLE ativos
    ADD COLUMN cotacao_atual NUMERIC(15, 4) DEFAULT 0,
    ADD COLUMN ultima_atualizacao TIMESTAMP;
  `);

  // 2. Tabela para o cache imutável do gráfico
  pgm.sql(`
    CREATE TABLE historico_cotacoes (
        id SERIAL PRIMARY KEY,
        ativo_id INTEGER NOT NULL REFERENCES ativos(id) ON DELETE CASCADE,
        data_referencia DATE NOT NULL,
        preco_fechamento NUMERIC(15, 4) NOT NULL,
        UNIQUE(ativo_id, data_referencia)
    );
  `);

  // 3. Índice para acelerar a busca do gráfico
  pgm.sql(`
    CREATE INDEX idx_historico_ativo_data ON historico_cotacoes(ativo_id, data_referencia);
  `);
};

exports.down = (pgm) => {
  // O processo inverso (na ordem inversa)
  pgm.sql(`DROP TABLE historico_cotacoes;`);

  pgm.sql(`
    ALTER TABLE ativos
    DROP COLUMN cotacao_atual,
    DROP COLUMN ultima_atualizacao;
  `);
};
