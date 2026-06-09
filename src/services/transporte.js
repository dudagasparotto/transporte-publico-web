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

export async function listarRotasComPontos() {
  const [linhasResp, rotasResp, pontosResp] = await Promise.all([
    api.get('/linhas'),
    api.get('/rotas'),
    api.get('/pontos'),
  ]);

  let horariosResp = { data: { dados: [] } };

  try {
    horariosResp = await api.get('/horarios');
  } catch (error) {
    console.error('Erro ao carregar horários do backend:', error);
  }

  const linhas = linhasResp.data.dados || [];
  const rotas = rotasResp.data.dados || [];
  const pontos = pontosResp.data.dados || [];
  const horarios = horariosResp.data.dados || [];

  return linhas.map((linha) => {
    const nomeLinha = linha.nome_linhas;
    const nomeMapa =
      mapasDasLinhas[nomeLinha] ? nomeLinha : nomesOriginaisDasLinhas[linha.id_linha];
    const dadosMapa = mapasDasLinhas[nomeMapa] || {};
    const rotasDaLinha = rotas.filter((rota) => rota.id_linha === linha.id_linha);

    const pontosDaLinha = pontos
      .filter((ponto) =>
        rotasDaLinha.some((rota) =>
          ponto.id_rota
            ? ponto.id_rota === rota.id_rota
            : ponto.id_pontos === rota.id_ponto
        )
      )
      .map((ponto) => ({
        id_ponto: ponto.id_pontos,
        nome_ponto: ponto.nome_pontos,
        latitude: ponto.latitude_pontos,
        longitude: ponto.longitude_pontos,
        localizacao: localizacaoPonto(ponto),
        horarios: horarios
          .filter((horario) => horario.id_ponto === ponto.id_pontos)
          .map((horario) => ({
            id_horario: horario.id_horario,
            hora: horaCurta(horario.passagem_horarios),
          })),
      }));

    return {
      id_linha: linha.id_linha,
      id_rota: rotasDaLinha[0]?.id_rota,
      nome_linha: nomeLinha,
      nome_linhas: nomeLinha,
      nome_mapa: nomeMapa || nomeLinha,
      mapa: dadosMapa.mapa || '',
      editar: dadosMapa.editar || '',
      cor: dadosMapa.cor || '#6B7280',
      saida: pontosDaLinha[0]?.nome_ponto || '',
      destino: pontosDaLinha[pontosDaLinha.length - 1]?.nome_ponto || '',
      paradas: pontosDaLinha.map((ponto) => ponto.nome_ponto),
      pontos: pontosDaLinha,
      motoristas: [],
    };
  });
}

export async function listarMotoristasDaRota(idRota) {
  if (!idRota) {
    return [];
  }

  const { data } = await api.get(`/rotas/${idRota}/motoristas`);
  return data.dados || [];
}

export async function buscarDetalhesDaRota(idRota) {
  if (!idRota) {
    return null;
  }

  const { data } = await api.get(`/rotas/${idRota}/detalhes`);
  return data.dados || null;
}

export async function listarRotasDoMotorista(idMotorista) {
  if (!idMotorista) {
    return [];
  }

  const { data } = await api.get(`/motoristas/${idMotorista}/rotas`);
  return data.dados?.rotas || [];
}
