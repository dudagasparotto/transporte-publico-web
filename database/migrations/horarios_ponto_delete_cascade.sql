ALTER TABLE horarios
DROP FOREIGN KEY horarios_ibfk_1;

ALTER TABLE horarios
ADD CONSTRAINT horarios_ibfk_1
FOREIGN KEY (id_ponto) REFERENCES pontos(id_pontos)
ON DELETE CASCADE;
