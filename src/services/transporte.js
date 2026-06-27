import api from './apis';

export const mapasDasLinhas = {
  ROXA: {
    cor: '#7C3AED',
    mapa: 'https://www.google.com/maps/d/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F',
    editar: 'https://www.google.com/maps/d/edit?hl=pt-BR&mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ll=-21.92382017330368%2C-50.50826300000001&z=14',
  },
  AZUL: {
    cor: '#2563EB',
    mapa: 'https://www.google.com/maps/d/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F',
    editar: 'https://www.google.com/maps/d/edit?hl=pt-BR&mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ll=-21.933259358327934%2C-50.50249973895575&z=15',
  },
  LARANJA: {
    cor: '#EA580C',
    mapa: 'https://www.google.com/maps/d/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F',
    editar: 'https://www.google.com/maps/d/edit?hl=pt-BR&mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ll=-21.931932733565503%2C-50.504239999999996&z=15',
  },
  AMARELA: {
    cor: '#EAB308',
    mapa: 'https://www.google.com/maps/d/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F',
    editar: 'https://www.google.com/maps/d/edit?hl=pt-BR&mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ll=-21.938244634367194%2C-50.50728750000001&z=15',
  },
};

const nomesOriginaisDasLinhas = {
  1: 'ROXA',
  2: 'AZUL',
  3: 'LARANJA',
  4: 'AMARELA',
};

function horaCurta(hora) {
  return hora ? String(hora).slice(0, 5) : '';
}

function localizacaoPonto(ponto) {
  return `${ponto.latitude_pontos}, ${ponto.longitude_pontos}`;
}

function mesmoId(idA, idB) {
  return Number(idA) === Number(idB);
}

function normalizarTrajeto(trajeto) {
  if (!trajeto) {
    return [];
  }

  try {
    const coordenadas =
      typeof trajeto === 'string' ? JSON.parse(trajeto) : trajeto;

    if (
      !Array.isArray(coordenadas) ||
      !coordenadas.every(
        (ponto) =>
          Array.isArray(ponto) &&
          ponto.length === 2 &&
          Number.isFinite(Number(ponto[0])) &&
          Number.isFinite(Number(ponto[1])) &&
          Number(ponto[0]) >= -90 &&
          Number(ponto[0]) <= 90 &&
          Number(ponto[1]) >= -180 &&
          Number(ponto[1]) <= 180
      )
    ) {
      return [];
    }

    return coordenadas.map((ponto) => [Number(ponto[0]), Number(ponto[1])]);
  } catch {
    return [];
  }
}

export async function carregarPrimeiroEndpointDisponivel(endpoints) {
  for (const endpoint of endpoints) {
    try {
      const { data } = await api.get(endpoint);
      return data.dados || [];
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error(`Erro ao carregar ${endpoint}:`, error);
      }
    }
  }

  return [];
}

export async function listarVinculosRotaMotorista() {
  const { data } = await api.get('/motoristas-rotas');
  return data.dados || [];
}

export async function salvarVinculosRotaMotorista(idMotorista, idsRotas) {
  await api.put(`/motoristas/${idMotorista}/rotas`, {
    ids_rotas: idsRotas.map(Number),
  });
}

function encontrarMotoristasDaRota(rotasDaLinha, vinculosRotaMotorista, motoristas) {
  const idsMotoristas = new Set(
    vinculosRotaMotorista
      .filter((item) =>
        rotasDaLinha.some((rota) => mesmoId(rota.id_rota, item.id_rota))
      )
      .map((item) => Number(item.id_motorista))
  );

  return motoristas.filter((motorista) =>
    idsMotoristas.has(Number(motorista.id_motorista))
  );
}

export async function listarRotasComPontos() {
  const [linhasResp, pontosResp] = await Promise.all([
    api.get('/linhas'),
    api.get('/pontos'),
  ]);

  let horariosResp = { data: { dados: [] } };
  const pontosRecebidos = pontosResp.data.dados || [];

  // A API atual falha em GET /rotas porque o banco não possui rotas.id_ponto.
  // Os pontos já trazem id_rota, portanto reconstruímos as rotas sem gerar 500.
  const rotas = (linhasResp.data.dados || []).map((linha) => {
    const pontosDaRota = pontosRecebidos.filter((ponto) =>
      mesmoId(ponto.id_rota, linha.id_linha)
    );

    return {
      id_rota: linha.id_linha,
      id_linha: linha.id_linha,
      id_ponto: pontosDaRota[0]?.id_pontos ?? null,
    };
  });

  try {
    horariosResp = await api.get('/horarios');
  } catch (error) {
    console.error('Erro ao carregar horários do backend:', error);
  }

  const [motoristas, vinculosRotaMotorista] = await Promise.all([
    carregarPrimeiroEndpointDisponivel(['/motoristas', '/motorista']),
    listarVinculosRotaMotorista(),
  ]);

  const linhas = linhasResp.data.dados || [];
  const pontos = pontosResp.data.dados || [];
  const horarios = horariosResp.data.dados || [];

  return linhas.map((linha) => {
    const nomeLinha = linha.nome_linhas;
    const nomeMapa =
      mapasDasLinhas[nomeLinha] ? nomeLinha : nomesOriginaisDasLinhas[linha.id_linha];
    const dadosMapa = mapasDasLinhas[nomeMapa] || {};
    const rotasDaLinha = rotas.filter((rota) => mesmoId(rota.id_linha, linha.id_linha));
    const motoristasDaRota = encontrarMotoristasDaRota(
      rotasDaLinha,
      vinculosRotaMotorista,
      motoristas
    );
    const motorista = motoristasDaRota[0] || null;

    const pontosDaLinha = pontos
      .filter((ponto) =>
        rotasDaLinha.some((rota) =>
          ponto.id_rota
            ? mesmoId(ponto.id_rota, rota.id_rota)
            : mesmoId(ponto.id_pontos, rota.id_ponto)
        )
      )
      .map((ponto) => ({
        id_ponto: ponto.id_pontos,
        nome_ponto: ponto.nome_pontos,
        latitude: ponto.latitude_pontos,
        longitude: ponto.longitude_pontos,
        localizacao: localizacaoPonto(ponto),
        horarios: horarios
          .filter((horario) => mesmoId(horario.id_ponto, ponto.id_pontos))
          .map((horario) => ({
            id_horario: horario.id_horario,
            hora: horaCurta(horario.passagem_horarios),
          })),
      }));

    return {
      id_linha: linha.id_linha,
      id_rota: rotasDaLinha[0]?.id_rota,
      id_ponto_referencia: rotasDaLinha[0]?.id_ponto ?? null,
      nome_linha: nomeLinha,
      nome_linhas: nomeLinha,
      nome_mapa: nomeMapa || nomeLinha,
      mapa: dadosMapa.mapa || '',
      editar: dadosMapa.editar || '',
      cor: rotasDaLinha[0]?.cor || dadosMapa.cor || '#6B7280',
      trajeto: normalizarTrajeto(rotasDaLinha[0]?.trajeto),
      saida: pontosDaLinha[0]?.nome_ponto || '',
      destino: pontosDaLinha[pontosDaLinha.length - 1]?.nome_ponto || '',
      paradas: pontosDaLinha.map((ponto) => ponto.nome_ponto),
      pontos: pontosDaLinha,
      motorista,
      motoristas: motoristasDaRota,
    };
  });
}
