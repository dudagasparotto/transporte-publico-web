UPDATE usuarios
SET id_motorista = NULL
WHERE id_tipo_usuario = 1;

ALTER TABLE usuarios
ADD CONSTRAINT chk_usuario_motorista
CHECK (
    (id_tipo_usuario = 1 AND id_motorista IS NULL)
    OR
    (id_tipo_usuario = 2 AND id_motorista IS NOT NULL)
);
