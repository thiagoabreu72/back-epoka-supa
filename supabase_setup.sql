-- ============================================================
-- TMS - Script SQL para Supabase
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. PERFIS
CREATE TABLE perfis (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao TEXT,
  permissoes JSONB NOT NULL DEFAULT '{
    "usuarios":  { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "perfis":    { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "ordens":    { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "cadastros": { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "dashboard": { "visualizar": false }
  }',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX perfis_nome_unique ON perfis (nome);

-- 2. USUÁRIOS
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco_rua VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  perfil_id INTEGER NOT NULL REFERENCES perfis(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  empresa_id VARCHAR(100),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX usuarios_email_unique ON usuarios (email);

-- 3. TAGS DE PEDÁGIO
CREATE TABLE tags_pedagio (
  id SERIAL PRIMARY KEY,
  codigo_tag VARCHAR(50) NOT NULL UNIQUE,
  operadora VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SITUAÇÕES
CREATE TABLE situacoes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  cor VARCHAR(20),
  ordem_fluxo INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TIPOS DE CARGA
CREATE TABLE tipos_carga (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ORDENS DE TRANSPORTE
CREATE TABLE ordens_transporte (
  id SERIAL PRIMARY KEY,
  situacao_id INTEGER NOT NULL REFERENCES situacoes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  lote VARCHAR(50),
  produto VARCHAR(255) NOT NULL,
  tipo_carga_id INTEGER NOT NULL REFERENCES tipos_carga(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  embarcador_id INTEGER NOT NULL REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  origem VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  cliente_pagador VARCHAR(255),
  placa VARCHAR(20),
  ctrc VARCHAR(50),
  valor_frete NUMERIC(10, 2),
  telefone_motorista VARCHAR(20),
  frete_motorista NUMERIC(10, 2),
  tag_pedagio_id INTEGER REFERENCES tags_pedagio(id) ON UPDATE CASCADE ON DELETE SET NULL,
  data_carregamento TIMESTAMPTZ,
  observacoes TEXT,
  rota TEXT,
  manifestador_id INTEGER REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ordens_transporte_situacao_id_idx ON ordens_transporte (situacao_id);
CREATE INDEX ordens_transporte_embarcador_id_idx ON ordens_transporte (embarcador_id);
CREATE INDEX ordens_transporte_manifestador_id_idx ON ordens_transporte (manifestador_id);
CREATE INDEX ordens_transporte_data_carregamento_idx ON ordens_transporte (data_carregamento);
CREATE INDEX ordens_transporte_placa_idx ON ordens_transporte (placa);

-- 7. LOGS DE ALTERAÇÕES
CREATE TYPE acao_log AS ENUM ('CREATE', 'UPDATE', 'DELETE');

CREATE TABLE logs_alteracoes (
  id SERIAL PRIMARY KEY,
  tabela VARCHAR(50) NOT NULL,
  registro_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  acao acao_log NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX logs_alteracoes_tabela_registro_idx ON logs_alteracoes (tabela, registro_id);
CREATE INDEX logs_alteracoes_usuario_id_idx ON logs_alteracoes (usuario_id);
CREATE INDEX logs_alteracoes_created_at_idx ON logs_alteracoes (created_at);

-- ============================================================
-- TRIGGER: atualiza updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_perfis_updated_at         BEFORE UPDATE ON perfis          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_usuarios_updated_at       BEFORE UPDATE ON usuarios         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tags_updated_at           BEFORE UPDATE ON tags_pedagio     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_situacoes_updated_at      BEFORE UPDATE ON situacoes        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tipos_carga_updated_at    BEFORE UPDATE ON tipos_carga      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_ordens_updated_at         BEFORE UPDATE ON ordens_transporte FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- O backend usa a service_role key, que bypassa o RLS.
-- Mesmo assim, habilitamos o RLS como boa prática.
-- Se quiser adicionar políticas granulares no futuro, é só
-- criar políticas abaixo sem precisar alterar a estrutura.
-- ============================================================
ALTER TABLE perfis             ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags_pedagio       ENABLE ROW LEVEL SECURITY;
ALTER TABLE situacoes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_carga        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_transporte  ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_alteracoes    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED INICIAL
-- ============================================================

-- Perfis
INSERT INTO perfis (nome, descricao, permissoes) VALUES
(
  'Administrador',
  'Acesso total ao sistema',
  '{
    "usuarios":  { "criar": true, "editar": true, "visualizar": true, "excluir": true },
    "perfis":    { "criar": true, "editar": true, "visualizar": true, "excluir": true },
    "ordens":    { "criar": true, "editar": true, "visualizar": true, "excluir": true },
    "cadastros": { "criar": true, "editar": true, "visualizar": true, "excluir": true },
    "dashboard": { "visualizar": true }
  }'
),
(
  'Embarcador',
  'Criação e acompanhamento de ordens de transporte',
  '{
    "usuarios":  { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "perfis":    { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "ordens":    { "criar": true,  "editar": true,  "visualizar": true,  "excluir": false },
    "cadastros": { "criar": false, "editar": false, "visualizar": true,  "excluir": false },
    "dashboard": { "visualizar": true }
  }'
),
(
  'Manifestador',
  'Manifestação e gerenciamento de ordens',
  '{
    "usuarios":  { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "perfis":    { "criar": false, "editar": false, "visualizar": false, "excluir": false },
    "ordens":    { "criar": false, "editar": true,  "visualizar": true,  "excluir": false },
    "cadastros": { "criar": false, "editar": false, "visualizar": true,  "excluir": false },
    "dashboard": { "visualizar": true }
  }'
);

-- Situações
INSERT INTO situacoes (nome, cor, ordem_fluxo) VALUES
('Aguardando',    '#FFA500', 1),
('Em Trânsito',   '#007BFF', 2),
('Entregue',      '#28A745', 3),
('Cancelado',     '#DC3545', 4);

-- Tipos de carga
INSERT INTO tipos_carga (descricao) VALUES
('Carga Geral'),
('Carga Frigorificada'),
('Carga Perigosa'),
('Carga Viva'),
('Granel Sólido'),
('Granel Líquido');

-- Usuário admin (senha: Admin@123)
-- Hash gerado com bcrypt rounds=10
INSERT INTO usuarios (nome, email, senha_hash, perfil_id, ativo) VALUES
(
  'Administrador',
  'admin@tms.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password (troque em produção!)
  (SELECT id FROM perfis WHERE nome = 'Administrador'),
  true
);
