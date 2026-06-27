-- Compatibilidade com a consulta atual da API de avaliações.
ALTER TABLE avaliacao
  ADD COLUMN id_usuario INT NULL AFTER id_avaliacao;
