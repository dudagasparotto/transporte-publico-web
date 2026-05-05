const STORAGE_KEY = 'transporte-publico-mock-data';

const initialMockData = {
  motoristas: [
    {
      id: 1,
      nome: 'João Paulo Silva',
      cpf: '123.456.789-00',
      cnh: 'MTR-4589',
      linha: 'Azul',
      codigo: 'MTR-4589',
      tempoPlataforma: '2 anos e 3 meses',
      foto: null,
    },
  ],
  rotas: [
    {
      id: 1,
      nome: 'Rota Roxa',
      saida: 'Terminal Central',
      destino: 'Bairro Roxo',
      mapa:
        'https://www.google.com/maps/d/u/1/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F&noprof=1',
      paradas: ['Terminal Central', 'Av. Principal', 'Mercado Central', 'Bairro Roxo'],
    },
    {
      id: 2,
      nome: 'Rota Azul',
      saida: 'Terminal Norte',
      destino: 'Bairro Azul',
      mapa:
        'https://www.google.com/maps/d/u/1/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F&noprof=1',
      paradas: ['Terminal Norte', 'Praça Azul', 'Hospital Municipal', 'Bairro Azul'],
    },
    {
      id: 3,
      nome: 'Rota Laranja',
      saida: 'Terminal Sul',
      destino: 'Bairro Laranja',
      mapa:
        'https://www.google.com/maps/d/u/1/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F&noprof=1',
      paradas: ['Terminal Sul', 'Av. das Flores', 'Shopping Sul', 'Bairro Laranja'],
    },
    {
      id: 4,
      nome: 'Rota Amarela',
      saida: 'Rodoviária',
      destino: 'Bairro Amarelo',
      mapa:
        'https://www.google.com/maps/d/u/1/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F&noprof=1',
      paradas: ['Rodoviária', 'Centro', 'Escola Municipal', 'Bairro Amarelo'],
    },
  ],
  pontos: [
    {
      id: 1,
      nome: 'Av. Central',
      sentido: 'Bairro',
      localizacao: 'Rua Principal, 321',
      rotaId: 1,
    },
    {
      id: 2,
      nome: 'Praça Azul',
      sentido: 'Centro',
      localizacao: 'Av. Azul, 45',
      rotaId: 2,
    },
  ],
  horarios: [
    {
      id: 1,
      linha: 'Linha Roxa',
      pontos: [
        { nome: 'Rodoviária', horarios: ['08:00', '09:00', '10:00', '11:00', '12:00'] },
        { nome: 'Mercado Central', horarios: ['08:10', '09:10', '10:10', '11:10'] },
      ],
    },
    {
      id: 2,
      linha: 'Linha Azul',
      pontos: [{ nome: 'Escola', horarios: ['08:20', '09:20', '10:20'] }],
    },
    {
      id: 3,
      linha: 'Linha Laranja',
      pontos: [{ nome: 'Terminal', horarios: ['07:00', '08:00', '09:00'] }],
    },
    {
      id: 4,
      linha: 'Linha Amarela',
      pontos: [{ nome: 'Centro', horarios: ['06:30', '07:30', '08:30'] }],
    },
  ],
  avaliacoes: [
    {
      id: 1,
      nome: 'Maria Souza',
      nota: 5,
      comentario: 'Motorista muito educado e pontual!',
      data: '10/04/2026',
    },
    {
      id: 2,
      nome: 'Carlos Lima',
      nota: 4,
      comentario: 'Dirige bem, mas poderia ser mais simpático.',
      data: '08/04/2026',
    },
    {
      id: 3,
      nome: 'Ana Clara',
      nota: 5,
      comentario: 'Excelente profissional, viagem tranquila.',
      data: '05/04/2026',
    },
  ],
};

function parseStoredData(raw) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Falha ao ler localStorage:', error);
    return null;
  }
}

export function initializeMockStorage() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData));
    return structuredClone(initialMockData);
  }

  const parsed = parseStoredData(raw);
  if (!parsed) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData));
    return structuredClone(initialMockData);
  }

  return parsed;
}

export function getMockStorage() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? parseStoredData(raw) : null;
  if (!parsed) {
    return initializeMockStorage();
  }
  return parsed;
}

export function saveMockStorage(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCollection(collectionName) {
  const store = getMockStorage();
  return store[collectionName] ?? [];
}

export function updateCollection(collectionName, value) {
  const store = getMockStorage();
  const next = { ...store, [collectionName]: value };
  saveMockStorage(next);
  return value;
}

export function addToCollection(collectionName, item) {
  const store = getMockStorage();
  const current = store[collectionName] ?? [];
  const next = { ...store, [collectionName]: [...current, item] };
  saveMockStorage(next);
  return item;
}

export function getNextId(collectionName) {
  const collection = getCollection(collectionName);
  return collection.length > 0 ? Math.max(...collection.map((item) => item.id || 0)) + 1 : 1;
}
