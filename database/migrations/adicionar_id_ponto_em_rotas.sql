-- Corrige bancos antigos usados pela API, nos quais rotas.id_ponto não existe.
-- Execute uma única vez no mesmo banco configurado no backend.

ALTER TABLE rotas
  ADD COLUMN id_ponto SMALLINT NULL AFTER id_linha;

ALTER TABLE rotas
  ADD INDEX idx_rotas_ponto (id_ponto);

ALTER TABLE rotas
  ADD CONSTRAINT fk_rotas_ponto
  FOREIGN KEY (id_ponto) REFERENCES pontos (id_pontos)
  ON DELETE SET NULL;
