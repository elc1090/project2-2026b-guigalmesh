exports.up = (pgm) => {
  pgm.sql(`
    CREATE TYPE classe_ativo AS ENUM ('ACAO', 'FII', 'RENDA_FIXA');
    CREATE TYPE tipo_operacao AS ENUM ('COMPRA', 'VENDA');
    CREATE TYPE categoria_provento AS ENUM ('DIVIDENDO', 'JCP', 'RENDIMENTO');
    CREATE TYPE categoria_evento AS ENUM ('DESDOBRAMENTO', 'GRUPAMENTO', 'BONIFICACAO_ACAO');

    CREATE TABLE usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO usuarios (id, nome, email)
    VALUES ('00000000-0000-0000-0000-000000000001', 'Usuário Inicial', 'admin@carteira.com');

    CREATE TABLE ativos (
        id SERIAL PRIMARY KEY,
        ticker_base VARCHAR(20) UNIQUE NOT NULL,
        classe classe_ativo NOT NULL,
        detalhes JSONB
    );

    CREATE TABLE posicoes_carteira (
        id SERIAL PRIMARY KEY,
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        ativo_id INTEGER NOT NULL REFERENCES ativos(id),
        quantidade NUMERIC(15, 8) DEFAULT 0,
        preco_medio NUMERIC(15, 4) DEFAULT 0,
        UNIQUE(usuario_id, ativo_id)
    );

    CREATE TABLE operacoes (
        id SERIAL PRIMARY KEY,
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        ativo_id INTEGER NOT NULL REFERENCES ativos(id),
        tipo tipo_operacao NOT NULL,
        quantidade NUMERIC(15, 8) NOT NULL CHECK (quantidade > 0),
        preco_unitario NUMERIC(15, 4) NOT NULL CHECK (preco_unitario > 0),
        custos NUMERIC(15, 4) DEFAULT 0,
        data_operacao TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE proventos (
        id SERIAL PRIMARY KEY,
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        ativo_id INTEGER NOT NULL REFERENCES ativos(id),
        categoria categoria_provento NOT NULL,
        valor_liquido NUMERIC(15, 4) NOT NULL CHECK (valor_liquido > 0),
        data_pagamento DATE NOT NULL
    );

    CREATE TABLE eventos_corporativos (
        id SERIAL PRIMARY KEY,
        ativo_id INTEGER NOT NULL REFERENCES ativos(id),
        categoria categoria_evento NOT NULL,
        fator_multiplicador NUMERIC(15, 8) NOT NULL,
        valor_atribuido NUMERIC(15, 4) DEFAULT 0,
        data_ex DATE NOT NULL
    );

    CREATE TABLE indicadores_economicos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(20) NOT NULL,
        data_referencia DATE NOT NULL,
        valor_percentual NUMERIC(10, 6) NOT NULL,
        frequencia VARCHAR(10) NOT NULL
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS indicadores_economicos;
    DROP TABLE IF EXISTS eventos_corporativos;
    DROP TABLE IF EXISTS proventos;
    DROP TABLE IF EXISTS operacoes;
    DROP TABLE IF EXISTS posicoes_carteira;
    DROP TABLE IF EXISTS ativos;
    DROP TABLE IF EXISTS usuarios;
    DROP TYPE IF EXISTS categoria_evento;
    DROP TYPE IF EXISTS categoria_provento;
    DROP TYPE IF EXISTS tipo_operacao;
    DROP TYPE IF EXISTS classe_ativo;
  `);
};
