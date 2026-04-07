import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import {
  ArrowLeft,
  Clock3,
  Route,
  MapPin,
  BusFront,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import "./styles.css";

// Corrige ícones do Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Dados de exemplo (depois você troca pelas coordenadas reais)
const pontosOnibus = [
  {
    id: 1,
    nome: "Ponto Central",
    posicao: [-21.9336, -50.5138],
    descricao: "Ponto principal no centro da cidade",
  },
  {
    id: 2,
    nome: "Ponto Vila Abarca",
    posicao: [-21.9298, -50.5205],
    descricao: "Ponto de embarque da região Vila Abarca",
  },
  {
    id: 3,
    nome: "Ponto Jardim Unesp",
    posicao: [-21.9282, -50.5030],
    descricao: "Ponto de referência para a população",
  },
  {
    id: 4,
    nome: "Ponto Parque Industrial",
    posicao: [-21.9270, -50.5300],
    descricao: "Ponto da área industrial",
  },
  {
    id: 5,
    nome: "Ponto Zona Leste",
    posicao: [-21.9378, -50.4975],
    descricao: "Ponto de apoio da zona leste",
  },
];

// Linha do ônibus (rota aproximada)
const rotaOnibus = [
  [-21.9270, -50.5300],
  [-21.9298, -50.5205],
  [-21.9336, -50.5138],
  [-21.9345, -50.5070],
  [-21.9282, -50.5030],
  [-21.9378, -50.4975],
];

// Ícone personalizado dos pontos
const pontoIcon = new L.DivIcon({
  html: `
    <div style="
      background: #1d4ed8;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    "></div>
  `,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Ícone da região central
const centroIcon = new L.DivIcon({
  html: `
    <div style="
      background: #0f172a;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 4px solid #22c55e;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    "></div>
  `,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function RotasLinhas() {
  const navigate = useNavigate();

  const [mostrarRota, setMostrarRota] = useState(true);
  const [mostrarPontos, setMostrarPontos] = useState(true);

  const centroMapa = [-21.9336, -50.5138];

  return (
    <div className="rotas-page">
      {/* TOPO */}
      <header className="rotas-topbar">
        <div className="rotas-brand">
          <div className="rotas-brand-icon">
            <BusFront size={26} />
          </div>

          <div>
            <p className="rotas-subtitle">Sistema de Transporte Público</p>
            <h1 className="rotas-title">Rotas e Linhas</h1>
          </div>
        </div>

        <div className="rotas-actions">
          <button className="btn-secundario" onClick={() => navigate("/home")}>
            <ArrowLeft size={18} />
            Voltar para Home
          </button>

          <button className="btn-primario" onClick={() => navigate("/horarios")}>
            <Clock3 size={18} />
            Ver Horários
          </button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="rotas-content">
        {/* LATERAL */}
        <aside className="rotas-sidebar">
          <div className="rotas-card">
            <h2>Controles do Mapa</h2>
            <p>
              Visualize a rota do ônibus e os pontos de parada para auxiliar a
              população na localização do embarque.
            </p>

            <div className="rotas-botoes">
              <button
                className={`btn-toggle ${mostrarRota ? "ativo" : ""}`}
                onClick={() => setMostrarRota(!mostrarRota)}
              >
                <Route size={18} />
                {mostrarRota ? "Ocultar Linhas" : "Mostrar Linhas"}
              </button>

              <button
                className={`btn-toggle ${mostrarPontos ? "ativo" : ""}`}
                onClick={() => setMostrarPontos(!mostrarPontos)}
              >
                <MapPin size={18} />
                {mostrarPontos ? "Ocultar Pontos" : "Mostrar Pontos"}
              </button>
            </div>
          </div>

          <div className="rotas-card">
            <h3>Finalidade da Tela</h3>
            <ul>
              <li>Exibir a rota aproximada do ônibus</li>
              <li>Mostrar pontos de embarque e referência</li>
              <li>Facilitar a localização dos usuários</li>
              <li>Melhorar a organização do transporte</li>
            </ul>
          </div>

          <div className="rotas-card">
            <h3>Legenda</h3>

            <div className="legenda-item">
              <span className="legenda-ponto"></span>
              <span>Pontos de parada</span>
            </div>

            <div className="legenda-item">
              <span className="legenda-linha"></span>
              <span>Trajeto da linha</span>
            </div>

            <div className="legenda-item">
              <span className="legenda-centro"></span>
              <span>Região central</span>
            </div>
          </div>
        </aside>

        {/* MAPA */}
        <section className="rotas-mapa-container">
          <div className="rotas-mapa-header">
            <h2>Mapa de Rotas e Pontos</h2>
            <p>
              Visualização geográfica das linhas percorridas e dos pontos de
              embarque do transporte público.
            </p>
          </div>

          <div className="rotas-mapa-box">
            <MapContainer
              center={centroMapa}
              zoom={14}
              scrollWheelZoom={true}
              className="mapa-leaflet"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Região central */}
              <Marker position={centroMapa} icon={centroIcon}>
                <Popup>
                  <strong>Região Central</strong>
                  <br />
                  Ponto principal de referência.
                </Popup>
              </Marker>

              {/* Linha da rota */}
              {mostrarRota && (
                <Polyline
                  positions={rotaOnibus}
                  pathOptions={{
                    color: "#1d4ed8",
                    weight: 6,
                    opacity: 0.85,
                  }}
                />
              )}

              {/* Pontos */}
              {mostrarPontos &&
                pontosOnibus.map((ponto) => (
                  <Marker
                    key={ponto.id}
                    position={ponto.posicao}
                    icon={pontoIcon}
                  >
                    <Popup>
                      <strong>{ponto.nome}</strong>
                      <br />
                      {ponto.descricao}
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </section>
      </main>
    </div>
  );
}