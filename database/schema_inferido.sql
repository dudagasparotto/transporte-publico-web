SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS avaliacao;
DROP TABLE IF EXISTS motoristas_rotas;
DROP TABLE IF EXISTS horarios;
DROP TABLE IF EXISTS pontos;
DROP TABLE IF EXISTS rotas;
DROP TABLE IF EXISTS linhas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS motoristas;
DROP TABLE IF EXISTS tipos_usuarios;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE tipos_usuarios (
  id_tipo_usuario INT NOT NULL AUTO_INCREMENT,
  nome_tipo_usuario VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_tipo_usuario),
  UNIQUE KEY uk_tipos_usuarios_nome (nome_tipo_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE motoristas (
  id_motorista INT NOT NULL AUTO_INCREMENT,
  cpf_motorista VARCHAR(14) NOT NULL,
  cnh_motorista VARCHAR(20) NOT NULL,
  nome_motorista VARCHAR(150) NOT NULL,
  foto_motorista VARCHAR(255) NULL,
  PRIMARY KEY (id_motorista),
  UNIQUE KEY uk_motoristas_cpf (cpf_motorista),
  UNIQUE KEY uk_motoristas_cnh (cnh_motorista)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  id_tipo_usuario INT NOT NULL,
  id_motorista INT NULL,
  nome_usuario VARCHAR(100) NOT NULL,
  senha_usuario VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uk_usuarios_nome (nome_usuario),
  KEY idx_usuarios_tipo (id_tipo_usuario),
  KEY idx_usuarios_motorista (id_motorista),
  CONSTRAINT fk_usuarios_tipo
    FOREIGN KEY (id_tipo_usuario) REFERENCES tipos_usuarios (id_tipo_usuario),
  CONSTRAINT fk_usuarios_motorista
    FOREIGN KEY (id_motorista) REFERENCES motoristas (id_motorista)
    ON DELETE CASCADE,
  CONSTRAINT chk_usuario_motorista CHECK (
    (id_tipo_usuario = 1 AND id_motorista IS NULL)
    OR
    (id_tipo_usuario = 2 AND id_motorista IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE linhas (
  id_linha INT NOT NULL AUTO_INCREMENT,
  nome_linhas VARCHAR(80) NOT NULL,
  PRIMARY KEY (id_linha),
  UNIQUE KEY uk_linhas_nome (nome_linhas)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rotas (
  id_rota INT NOT NULL AUTO_INCREMENT,
  id_linha INT NOT NULL,
  id_ponto INT NULL,
  cor VARCHAR(20) NULL,
  trajeto JSON NULL,
  PRIMARY KEY (id_rota),
  KEY idx_rotas_linha (id_linha),
  KEY idx_rotas_ponto (id_ponto),
  CONSTRAINT fk_rotas_linha
    FOREIGN KEY (id_linha) REFERENCES linhas (id_linha)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pontos (
  id_pontos INT NOT NULL AUTO_INCREMENT,
  id_rota INT NULL,
  nome_pontos VARCHAR(150) NOT NULL,
  latitude_pontos DECIMAL(11,8) NOT NULL,
  longitude_pontos DECIMAL(11,8) NOT NULL,
  PRIMARY KEY (id_pontos),
  KEY idx_pontos_rota (id_rota),
  CONSTRAINT fk_pontos_rota
    FOREIGN KEY (id_rota) REFERENCES rotas (id_rota)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE rotas
  ADD CONSTRAINT rotas_ibfk_1
  FOREIGN KEY (id_ponto) REFERENCES pontos (id_pontos)
  ON DELETE SET NULL;

CREATE TABLE horarios (
  id_horario INT NOT NULL AUTO_INCREMENT,
  id_ponto INT NOT NULL,
  passagem_horarios TIME NOT NULL,
  PRIMARY KEY (id_horario),
  KEY idx_horarios_ponto (id_ponto),
  CONSTRAINT horarios_ibfk_1
    FOREIGN KEY (id_ponto) REFERENCES pontos (id_pontos)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE motoristas_rotas (
  id_motorista_rota INT NOT NULL AUTO_INCREMENT,
  id_motorista INT NOT NULL,
  id_rota INT NOT NULL,
  PRIMARY KEY (id_motorista_rota),
  UNIQUE KEY uk_motoristas_rotas (id_motorista, id_rota),
  KEY idx_motoristas_rotas_rota (id_rota),
  CONSTRAINT fk_motoristas_rotas_motorista
    FOREIGN KEY (id_motorista) REFERENCES motoristas (id_motorista)
    ON DELETE CASCADE,
  CONSTRAINT fk_motoristas_rotas_rota
    FOREIGN KEY (id_rota) REFERENCES rotas (id_rota)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE avaliacao (
  id_avaliacao INT NOT NULL AUTO_INCREMENT,
  id_motorista INT NOT NULL,
  nota_avaliacao TINYINT NOT NULL,
  comentario_avaliacao TEXT NULL,
  data_avaliacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_avaliacao),
  KEY idx_avaliacao_motorista (id_motorista),
  CONSTRAINT fk_avaliacao_motorista
    FOREIGN KEY (id_motorista) REFERENCES motoristas (id_motorista)
    ON DELETE CASCADE,
  CONSTRAINT chk_avaliacao_nota CHECK (nota_avaliacao BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
