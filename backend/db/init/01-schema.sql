-- ==========================================
-- 1. ENUMS
-- ==========================================
CREATE TYPE classe_ativo AS ENUM ('ACAO', 'FII', 'RENDA_FIXA');
CREATE TYPE tipo_operacao AS ENUM ('COMPRA', 'VENDA');
CREATE TYPE categoria_provento AS ENUM ('DIVIDENDO', 'JCP', 'RENDIMENTO');
CREATE TYPE categoria_evento AS ENUM ('DESDOBRAMENTO', 'GRUPAMENTO', 'BONIFICACAO_ACAO');

-- ==========================================
-- 2. TABELAS DE BASE E CATÁLOGO
-- ==========================================

-- Preparado para o futuro multiusuário
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuário inicial para ficar fácil de inserir multiusuário mais tarde
INSERT INTO usuarios (id, nome, email) VALUES ('00000000-0000-0000-0000-000000000001', 'Usuário Inicial', 'admin@carteira.com');

CREATE TABLE ativos (
    id SERIAL PRIMARY KEY,
    ticker_base VARCHAR(20) UNIQUE NOT NULL, -- Ex: PETR4, HGLG11, Tesouro IPCA+ 2029
    classe classe_ativo NOT NULL,

    detalhes JSONB
);

-- ==========================================
-- 3. A CARTEIRA DO USUÁRIO
-- ==========================================
CREATE TABLE posicoes_carteira (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    ativo_id INTEGER NOT NULL REFERENCES ativos(id),

    -- NUMERIC(15,8) porque Renda Fixa (Tesouro Direto) permite frações de títulos
    quantidade NUMERIC(15, 8) DEFAULT 0,
    preco_medio NUMERIC(15, 4) DEFAULT 0,

    UNIQUE(usuario_id, ativo_id)
);

-- ==========================================
-- 4. HISTÓRICO DE MOVIMENTAÇÕES
-- ==========================================

-- As ações do usuário. A regra do Preço Médio e Custos vive aqui.
CREATE TABLE operacoes (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    ativo_id INTEGER NOT NULL REFERENCES ativos(id),
    tipo tipo_operacao NOT NULL,

    quantidade NUMERIC(15, 8) NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(15, 4) NOT NULL CHECK (preco_unitario > 0),

    -- Custos operacionais (corretagem, B3, taxas).
    -- Na COMPRA, somam ao total financeiro (aumenta o Preço Médio).
    -- Na VENDA, subtraem do total financeiro (diminui o lucro líquido).
    custos NUMERIC(15, 4) DEFAULT 0,

    data_operacao TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- O dinheiro que entra passivamente na conta
CREATE TABLE proventos (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    ativo_id INTEGER NOT NULL REFERENCES ativos(id),
    categoria categoria_provento NOT NULL,
    valor_liquido NUMERIC(15, 4) NOT NULL CHECK (valor_liquido > 0),
    data_pagamento DATE NOT NULL
);

-- ==========================================
-- 5. EVENTOS DO MERCADO
-- ==========================================

-- Ações da empresa que alteram a carteira do usuário sem ele fazer nada
CREATE TABLE eventos_corporativos (
    id SERIAL PRIMARY KEY,
    ativo_id INTEGER NOT NULL REFERENCES ativos(id),
    categoria categoria_evento NOT NULL,

    -- Para desdobramento 1:4, o fator_multiplicador é 4. (Qtd * 4, Preço Médio / 4)
    -- Para grupamento 4:1, o fator_multiplicador é 0.25. (Qtd * 0.25, Preço Médio / 0.25)
    fator_multiplicador NUMERIC(15, 8) NOT NULL,

    -- Se for bonificação de ações, qual foi o custo atribuído à nova ação recebida
    valor_atribuido NUMERIC(15, 4) DEFAULT 0,

    data_ex DATE NOT NULL
);

-- Tabela de benchmarks para Renda Fixa e cálculo de TWR
CREATE TABLE indicadores_economicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL, -- SELIC, CDI, IPCA
    data_referencia DATE NOT NULL,
    valor_percentual NUMERIC(10, 6) NOT NULL, -- Ex: 0.0815 para a taxa DI do dia
    frequencia VARCHAR(10) NOT NULL -- DIARIO ou MENSAL
);
