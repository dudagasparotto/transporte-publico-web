import fs from 'node:fs/promises';

const rotas = [
  {
    nome: 'ROXA',
    cor: '#7C3AED',
    url: 'https://www.google.com/maps/d/kml?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&forcekml=1',
  },
  {
    nome: 'AZUL',
    cor: '#2563EB',
    url: 'https://www.google.com/maps/d/kml?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&forcekml=1',
  },
  {
    nome: 'LARANJA',
    cor: '#EA580C',
    url: 'https://www.google.com/maps/d/kml?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&forcekml=1',
  },
  {
    nome: 'AMARELA',
    cor: '#EAB308',
    url: 'https://www.google.com/maps/d/kml?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&forcekml=1',
  },
];

function limparTexto(texto) {
  return texto
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function extrairTag(texto, tag) {
  const match = texto.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? limparTexto(match[1]) : '';
}

function extrairCoordenadas(texto) {
  return texto
    .trim()
    .split(/\s+/)
    .map((item) => {
      const [lng, lat] = item.split(',').map(Number);
      return [lat, lng];
    })
    .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
}

function extrairPlacemark(kml) {
  const placemarks = [...kml.matchAll(/<Placemark>([\s\S]*?)<\/Placemark>/gi)];

  return placemarks.map((placemarkMatch) => {
    const placemark = placemarkMatch[1];
    const nome = extrairTag(placemark, 'name');
    const coordinatesMatch = placemark.match(/<coordinates>([\s\S]*?)<\/coordinates>/i);
    const coordenadas = coordinatesMatch ? extrairCoordenadas(coordinatesMatch[1]) : [];

    if (coordenadas.length === 0) return null;

    if (/<Point>/i.test(placemark)) {
      return {
        tipo: 'ponto',
        nome,
        coordenadas: coordenadas[0],
      };
    }

    if (/<Polygon>/i.test(placemark)) {
      return {
        tipo: 'poligono',
        nome,
        coordenadas,
      };
    }

    return {
      tipo: 'linha',
      nome,
      coordenadas,
    };
  }).filter(Boolean);
}

const dados = [];

for (const rota of rotas) {
  const resposta = await fetch(rota.url);

  if (!resposta.ok) {
    throw new Error(`Erro ao baixar ${rota.nome}: ${resposta.status}`);
  }

  const kml = await resposta.text();

  dados.push({
    nome: rota.nome,
    cor: rota.cor,
    elementos: extrairPlacemark(kml),
  });
}

await fs.writeFile(
  new URL('../src/data/rotasLeaflet.js', import.meta.url),
  `export const rotasLeaflet = ${JSON.stringify(dados, null, 2)};\n`
);

console.log('Rotas Leaflet geradas em src/data/rotasLeaflet.js');
