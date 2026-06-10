import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './styles.module.css';
import { rotasLeaflet } from '../../data/rotasLeaflet';

function normalizarNome(nome) {
  return String(nome || '').trim().toUpperCase();
}

function adicionarCoordenadas(bounds, coordenadas) {
  if (!Array.isArray(coordenadas)) {
    return;
  }

  if (typeof coordenadas[0] === 'number') {
    bounds.push(coordenadas);
    return;
  }

  coordenadas.forEach((item) => adicionarCoordenadas(bounds, item));
}

function coordenadasDoPonto(ponto) {
  const latitude = Number(ponto.latitude_pontos ?? ponto.latitude);
  const longitude = Number(ponto.longitude_pontos ?? ponto.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return [latitude, longitude];
}

function pontoNaRegiaoDeTupa(coordenadas) {
  return (
    coordenadas[0] >= -22.1 &&
    coordenadas[0] <= -21.75 &&
    coordenadas[1] >= -50.7 &&
    coordenadas[1] <= -50.35
  );
}

function criarIconePonto(cor = '#2563eb', destaque = false) {
  return L.divIcon({
    className: styles.marcadorPonto,
    html: `<span class="${styles.pino} ${
      destaque ? styles.pinoDestaque : ''
    }" style="background:${cor}"><span class="${styles.miolo}"></span></span>`,
    iconSize: [32, 40],
    iconAnchor: [16, 39],
    popupAnchor: [0, -34],
  });
}

export default function LeafletRouteMap({
  rotaNome,
  className,
  pontos = [],
  pontoMarcado = null,
  onSelecionarLocal,
  onSelecionarPonto,
  onMoverPonto,
  mostrarTrajetoPontos = false,
  corTrajeto = '#2563eb',
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const pointLayerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([-21.9333, -50.5195], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    mapRef.current = map;
    routeLayerRef.current = L.layerGroup().addTo(map);
    pointLayerRef.current = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
      pointLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = routeLayerRef.current;

    if (!map || !layer) {
      return;
    }

    layer.clearLayers();

    if (!rotaNome) {
      map.setView([-21.9333, -50.5195], 14);
      setTimeout(() => map.invalidateSize(), 0);
      return;
    }

    const rota = rotasLeaflet.find(
      (item) => normalizarNome(item.nome) === normalizarNome(rotaNome)
    );

    if (!rota) {
      map.setView([-21.9333, -50.5195], 14);
      setTimeout(() => map.invalidateSize(), 0);
      return;
    }

    const bounds = [];

    rota.elementos.forEach((elemento) => {
      if (elemento.tipo === 'ponto') {
        return;
      }

      adicionarCoordenadas(bounds, elemento.coordenadas);

      const opcoes = {
        color: rota.cor,
        fillColor: rota.cor,
        fillOpacity: elemento.tipo === 'poligono' ? 0.18 : 0.08,
        opacity: 0.9,
        weight: elemento.tipo === 'linha' ? 6 : 3,
      };

      if (elemento.tipo === 'poligono') {
        L.polygon(elemento.coordenadas, opcoes)
          .bindPopup(elemento.nome || rota.nome)
          .addTo(layer);
        return;
      }

      L.polyline(elemento.coordenadas, opcoes)
        .bindPopup(elemento.nome || rota.nome)
        .addTo(layer);
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), {
        padding: [24, 24],
        maxZoom: 16,
      });
    }

    setTimeout(() => map.invalidateSize(), 0);
  }, [rotaNome]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !onSelecionarLocal) {
      return undefined;
    }

    function selecionarLocal(event) {
      onSelecionarLocal({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    }

    map.on('click', selecionarLocal);

    return () => {
      map.off('click', selecionarLocal);
    };
  }, [onSelecionarLocal]);

  useEffect(() => {
    const layer = pointLayerRef.current;

    if (!layer) {
      return;
    }

    layer.clearLayers();

    const pontosDoTrajeto = pontos
      .map((ponto) => coordenadasDoPonto(ponto))
      .filter((coordenadas) => coordenadas && pontoNaRegiaoDeTupa(coordenadas));

    if (mostrarTrajetoPontos && pontosDoTrajeto.length > 1) {
      L.polyline(pontosDoTrajeto, {
        color: corTrajeto,
        opacity: 0.95,
        weight: 5,
      })
        .bindPopup('Trajeto pelos pontos cadastrados')
        .addTo(layer);
    }

    pontos.forEach((ponto) => {
      const coordenadas = coordenadasDoPonto(ponto);

      if (!coordenadas) {
        return;
      }

      const marker = L.marker(coordenadas, {
        icon: criarIconePonto(corTrajeto),
        draggable: Boolean(onMoverPonto),
      })
        .bindPopup(ponto.nome_ponto || ponto.nome_pontos || 'Ponto')
        .addTo(layer);

      if (onSelecionarPonto) {
        marker.on('click', () => onSelecionarPonto(ponto));
      }

      if (onMoverPonto) {
        marker.on('dragend', (event) => {
          const posicao = event.target.getLatLng();

          onMoverPonto(ponto, {
            latitude: posicao.lat,
            longitude: posicao.lng,
          });
        });
      }
    });

    if (pontoMarcado) {
      const latitude = Number(pontoMarcado.latitude);
      const longitude = Number(pontoMarcado.longitude);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        L.marker([latitude, longitude], {
          icon: criarIconePonto(corTrajeto, true),
        })
          .bindPopup(pontoMarcado.nome || 'Novo ponto')
          .addTo(layer)
          .openPopup();
      }
    }
  }, [
    pontos,
    pontoMarcado,
    onSelecionarPonto,
    onMoverPonto,
    mostrarTrajetoPontos,
    corTrajeto,
  ]);

  return (
    <div
      className={`${styles.mapa} ${onSelecionarLocal ? styles.clicavel : ''} ${
        className || ''
      }`}
    >
      <div ref={containerRef} className={styles.leaflet} />
    </div>
  );
}
