exports.up = (pgm) => {
  pgm.sql(`
    CREATE INDEX idx_operacoes_usuario ON operacoes(usuario_id);
    CREATE INDEX idx_operacoes_ativo ON operacoes(ativo_id);
    CREATE INDEX idx_posicoes_usuario ON posicoes_carteira(usuario_id);
    CREATE INDEX idx_proventos_usuario ON proventos(usuario_id);

    ALTER TABLE indicadores_economicos
      ADD CONSTRAINT uq_indicador_data UNIQUE (nome, data_referencia);

    ALTER TABLE operacoes
      ALTER COLUMN data_operacao TYPE TIMESTAMPTZ USING data_operacao AT TIME ZONE 'America/Sao_Paulo',
      ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Sao_Paulo';

    ALTER TABLE usuarios
      ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Sao_Paulo';

    CREATE TABLE cotacoes_cache (
        ativo_id INTEGER PRIMARY KEY REFERENCES ativos(id),
        preco NUMERIC(15, 4) NOT NULL,
        atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS cotacoes_cache;

    ALTER TABLE usuarios
      ALTER COLUMN created_at TYPE TIMESTAMP;

    ALTER TABLE operacoes
      ALTER COLUMN data_operacao TYPE TIMESTAMP,
      ALTER COLUMN created_at TYPE TIMESTAMP;

    ALTER TABLE indicadores_economicos
      DROP CONSTRAINT IF EXISTS uq_indicador_data;

    DROP INDEX IF EXISTS idx_proventos_usuario;
    DROP INDEX IF EXISTS idx_posicoes_usuario;
    DROP INDEX IF EXISTS idx_operacoes_ativo;
    DROP INDEX IF EXISTS idx_operacoes_usuario;
  `);
};
