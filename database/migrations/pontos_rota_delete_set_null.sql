ALTER TABLE pontos
DROP FOREIGN KEY fk_pontos_rota;

ALTER TABLE pontos
MODIFY id_rota SMALLINT NULL;

ALTER TABLE pontos
ADD CONSTRAINT fk_pontos_rota
FOREIGN KEY (id_rota) REFERENCES rotas(id_rota)
ON DELETE SET NULL;
