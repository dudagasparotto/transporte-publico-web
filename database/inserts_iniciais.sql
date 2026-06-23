INSERT INTO tipos_usuarios (id_tipo_usuario, nome_tipo_usuario) VALUES
  (1, 'ADMINISTRADOR'),
  (2, 'MOTORISTA');

INSERT INTO motoristas (
  id_motorista,
  cpf_motorista,
  cnh_motorista,
  nome_motorista,
  foto_motorista
) VALUES
  (1, '11122233344', '12345678900', 'Ana Paula Martins', NULL),
  (2, '22233344455', '22345678900', 'Bruno Henrique Costa', NULL),
  (3, '33344455566', '32345678900', 'Carla Souza Lima', NULL),
  (4, '44455566677', '42345678900', 'Diego Almeida Rocha', NULL);

INSERT INTO usuarios (
  id_usuario,
  id_tipo_usuario,
  id_motorista,
  nome_usuario,
  senha_usuario
) VALUES
  (1, 1, NULL, 'admin', 'admin123'),
  (2, 2, 1, 'ana.motorista', 'motorista123'),
  (3, 2, 2, 'bruno.motorista', 'motorista123'),
  (4, 2, 3, 'carla.motorista', 'motorista123'),
  (5, 2, 4, 'diego.motorista', 'motorista123');

INSERT INTO linhas (id_linha, nome_linhas) VALUES
  (1, 'ROXA'),
  (2, 'AZUL'),
  (3, 'LARANJA'),
  (4, 'AMARELA'),
  (5, 'VERDE'),
  (6, 'VERMELHA'),
  (7, 'ROSA'),
  (8, 'MARROM'),
  (9, 'CINZA'),
  (10, 'PRETA');

INSERT INTO rotas (id_rota, id_linha, id_ponto, cor, trajeto) VALUES
  (1, 1, NULL, '#7C3AED', JSON_ARRAY(JSON_ARRAY(-21.93330000, -50.51950000), JSON_ARRAY(-21.93190000, -50.51420000), JSON_ARRAY(-21.92990000, -50.51190000))),
  (2, 2, NULL, '#2563EB', JSON_ARRAY(JSON_ARRAY(-21.93330000, -50.51950000), JSON_ARRAY(-21.93600000, -50.51000000), JSON_ARRAY(-21.93480000, -50.50650000))),
  (3, 3, NULL, '#EA580C', JSON_ARRAY(JSON_ARRAY(-21.93190000, -50.50424000), JSON_ARRAY(-21.92880000, -50.50080000), JSON_ARRAY(-21.92590000, -50.49870000))),
  (4, 4, NULL, '#EAB308', JSON_ARRAY(JSON_ARRAY(-21.93824463, -50.50728750), JSON_ARRAY(-21.94030000, -50.50190000), JSON_ARRAY(-21.94210000, -50.49920000))),
  (5, 5, NULL, '#16A34A', JSON_ARRAY(JSON_ARRAY(-21.93510000, -50.52260000), JSON_ARRAY(-21.93720000, -50.51840000), JSON_ARRAY(-21.93900000, -50.51520000))),
  (6, 6, NULL, '#DC2626', JSON_ARRAY(JSON_ARRAY(-21.92760000, -50.52010000), JSON_ARRAY(-21.92550000, -50.51620000), JSON_ARRAY(-21.92380000, -50.51290000))),
  (7, 7, NULL, '#DB2777', JSON_ARRAY(JSON_ARRAY(-21.94150000, -50.51470000), JSON_ARRAY(-21.94310000, -50.51070000), JSON_ARRAY(-21.94450000, -50.50730000))),
  (8, 8, NULL, '#92400E', JSON_ARRAY(JSON_ARRAY(-21.93070000, -50.52620000), JSON_ARRAY(-21.92890000, -50.52300000), JSON_ARRAY(-21.92640000, -50.51980000))),
  (9, 9, NULL, '#6B7280', JSON_ARRAY(JSON_ARRAY(-21.94500000, -50.52210000), JSON_ARRAY(-21.94620000, -50.51820000), JSON_ARRAY(-21.94760000, -50.51450000))),
  (10, 10, NULL, '#111827', JSON_ARRAY(JSON_ARRAY(-21.92250000, -50.50780000), JSON_ARRAY(-21.92420000, -50.50420000), JSON_ARRAY(-21.92600000, -50.50100000)));

INSERT INTO pontos (
  id_pontos,
  id_rota,
  nome_pontos,
  latitude_pontos,
  longitude_pontos
) VALUES
  (1, 1, 'Terminal Central', -21.93330000, -50.51950000),
  (2, 1, 'Praca da Matriz', -21.93190000, -50.51420000),
  (3, 1, 'Centro Cultural', -21.92990000, -50.51190000),
  (4, 2, 'Avenida Principal', -21.93330000, -50.51950000),
  (5, 2, 'Escola Municipal', -21.93600000, -50.51000000),
  (6, 2, 'Posto de Saude', -21.93480000, -50.50650000),
  (7, 3, 'Rodoviaria', -21.93190000, -50.50424000),
  (8, 3, 'Bairro Industrial', -21.92880000, -50.50080000),
  (9, 3, 'Distrito Leste', -21.92590000, -50.49870000),
  (10, 4, 'Hospital Municipal', -21.93824463, -50.50728750),
  (11, 4, 'Jardim das Flores', -21.94030000, -50.50190000),
  (12, 4, 'Parque Novo', -21.94210000, -50.49920000),
  (13, 5, 'Vila Verde', -21.93510000, -50.52260000),
  (14, 5, 'Rua das Palmeiras', -21.93720000, -50.51840000),
  (15, 5, 'Conjunto Esperanca', -21.93900000, -50.51520000),
  (16, 6, 'Vila Norte', -21.92760000, -50.52010000),
  (17, 6, 'Mercado Municipal', -21.92550000, -50.51620000),
  (18, 6, 'Estadio', -21.92380000, -50.51290000),
  (19, 7, 'Residencial Primavera', -21.94150000, -50.51470000),
  (20, 7, 'Creche Municipal', -21.94310000, -50.51070000),
  (21, 7, 'Lago Azul', -21.94450000, -50.50730000),
  (22, 8, 'Vila Rural', -21.93070000, -50.52620000),
  (23, 8, 'Cooperativa', -21.92890000, -50.52300000),
  (24, 8, 'Estrada Velha', -21.92640000, -50.51980000),
  (25, 9, 'Alto da Serra', -21.94500000, -50.52210000),
  (26, 9, 'Condominio Bela Vista', -21.94620000, -50.51820000),
  (27, 9, 'Mirante', -21.94760000, -50.51450000),
  (28, 10, 'Vila Sul', -21.92250000, -50.50780000),
  (29, 10, 'Rua das Acacias', -21.92420000, -50.50420000),
  (30, 10, 'Terminal Sul', -21.92600000, -50.50100000);

UPDATE rotas SET id_ponto = 1 WHERE id_rota = 1;
UPDATE rotas SET id_ponto = 4 WHERE id_rota = 2;
UPDATE rotas SET id_ponto = 7 WHERE id_rota = 3;
UPDATE rotas SET id_ponto = 10 WHERE id_rota = 4;
UPDATE rotas SET id_ponto = 13 WHERE id_rota = 5;
UPDATE rotas SET id_ponto = 16 WHERE id_rota = 6;
UPDATE rotas SET id_ponto = 19 WHERE id_rota = 7;
UPDATE rotas SET id_ponto = 22 WHERE id_rota = 8;
UPDATE rotas SET id_ponto = 25 WHERE id_rota = 9;
UPDATE rotas SET id_ponto = 28 WHERE id_rota = 10;

INSERT INTO horarios (id_horario, id_ponto, passagem_horarios) VALUES
  (1, 1, '06:00:00'), (2, 1, '12:00:00'), (3, 1, '18:00:00'),
  (4, 2, '06:10:00'), (5, 2, '12:10:00'), (6, 2, '18:10:00'),
  (7, 3, '06:20:00'), (8, 3, '12:20:00'), (9, 3, '18:20:00'),
  (10, 4, '06:05:00'), (11, 4, '12:05:00'), (12, 4, '18:05:00'),
  (13, 5, '06:15:00'), (14, 5, '12:15:00'), (15, 5, '18:15:00'),
  (16, 6, '06:25:00'), (17, 6, '12:25:00'), (18, 6, '18:25:00'),
  (19, 7, '06:30:00'), (20, 7, '12:30:00'), (21, 7, '18:30:00'),
  (22, 8, '06:40:00'), (23, 8, '12:40:00'), (24, 8, '18:40:00'),
  (25, 9, '06:50:00'), (26, 9, '12:50:00'), (27, 9, '18:50:00'),
  (28, 10, '07:00:00'), (29, 10, '13:00:00'), (30, 10, '19:00:00'),
  (31, 11, '07:10:00'), (32, 11, '13:10:00'), (33, 11, '19:10:00'),
  (34, 12, '07:20:00'), (35, 12, '13:20:00'), (36, 12, '19:20:00'),
  (37, 13, '07:30:00'), (38, 13, '13:30:00'), (39, 13, '19:30:00'),
  (40, 14, '07:40:00'), (41, 14, '13:40:00'), (42, 14, '19:40:00'),
  (43, 15, '07:50:00'), (44, 15, '13:50:00'), (45, 15, '19:50:00'),
  (46, 16, '08:00:00'), (47, 16, '14:00:00'), (48, 16, '20:00:00'),
  (49, 17, '08:10:00'), (50, 17, '14:10:00'), (51, 17, '20:10:00'),
  (52, 18, '08:20:00'), (53, 18, '14:20:00'), (54, 18, '20:20:00'),
  (55, 19, '08:30:00'), (56, 19, '14:30:00'), (57, 19, '20:30:00'),
  (58, 20, '08:40:00'), (59, 20, '14:40:00'), (60, 20, '20:40:00'),
  (61, 21, '08:50:00'), (62, 21, '14:50:00'), (63, 21, '20:50:00'),
  (64, 22, '09:00:00'), (65, 22, '15:00:00'), (66, 22, '21:00:00'),
  (67, 23, '09:10:00'), (68, 23, '15:10:00'), (69, 23, '21:10:00'),
  (70, 24, '09:20:00'), (71, 24, '15:20:00'), (72, 24, '21:20:00'),
  (73, 25, '09:30:00'), (74, 25, '15:30:00'), (75, 25, '21:30:00'),
  (76, 26, '09:40:00'), (77, 26, '15:40:00'), (78, 26, '21:40:00'),
  (79, 27, '09:50:00'), (80, 27, '15:50:00'), (81, 27, '21:50:00'),
  (82, 28, '10:00:00'), (83, 28, '16:00:00'), (84, 28, '22:00:00'),
  (85, 29, '10:10:00'), (86, 29, '16:10:00'), (87, 29, '22:10:00'),
  (88, 30, '10:20:00'), (89, 30, '16:20:00'), (90, 30, '22:20:00');

INSERT INTO motoristas_rotas (id_motorista_rota, id_motorista, id_rota) VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 5),
  (4, 2, 3),
  (5, 2, 4),
  (6, 2, 6),
  (7, 3, 7),
  (8, 3, 8),
  (9, 4, 9),
  (10, 4, 10);

INSERT INTO avaliacao (
  id_avaliacao,
  id_motorista,
  nota_avaliacao,
  comentario_avaliacao,
  data_avaliacao
) VALUES
  (1, 1, 5, 'Motorista atenciosa e pontual.', CURRENT_TIMESTAMP),
  (2, 1, 4, 'Boa conducao durante o trajeto.', CURRENT_TIMESTAMP),
  (3, 2, 5, 'Viagem tranquila e onibus no horario.', CURRENT_TIMESTAMP),
  (4, 2, 3, 'A rota atrasou um pouco no periodo da tarde.', CURRENT_TIMESTAMP),
  (5, 3, 4, 'Motorista educada e cuidadosa.', CURRENT_TIMESTAMP),
  (6, 3, 5, 'Excelente atendimento aos passageiros.', CURRENT_TIMESTAMP),
  (7, 4, 4, 'Conducao segura.', CURRENT_TIMESTAMP),
  (8, 4, 5, 'Chegou no ponto no horario combinado.', CURRENT_TIMESTAMP);
