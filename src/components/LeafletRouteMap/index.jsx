import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './styles.module.css';
import { rotasLeaflet } from '../../data/rotasLeaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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

export default function LeafletRouteMap({ rotaNome, className }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

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
    layerRef.current = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;

    if (!map || !layer) {
      return;
    }

    layer.clearLayers();

    const rota =
      rotasLeaflet.find(
        (item) => normalizarNome(item.nome) === normalizarNome(rotaNome)
      ) || rotasLeaflet[0];

    if (!rota) {
      return;
    }

    const bounds = [];

    rota.elementos.forEach((elemento) => {
      adicionarCoordenadas(bounds, elemento.coordenadas);

      const opcoes = {
        color: rota.cor,
        fillColor: rota.cor,
        fillOpacity: elemento.tipo === 'poligono' ? 0.18 : 0.08,
        opacity: 0.9,
        weight: elemento.tipo === 'linha' ? 6 : 3,
      };

      if (elemento.tipo === 'ponto') {
        L.marker(elemento.coordenadas)
          .bindPopup(elemento.nome || rota.nome)
          .addTo(layer);
        return;
      }

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

  return (
    <div className={`${styles.mapa} ${className || ''}`}>
      <div ref={containerRef} className={styles.leaflet} />
    </div>
  );
}
