import { useState } from "react";
import "./styles.css";

export default function editarRota() {
  const [rota, setRota] = useState("101 Vila Nova");
  const [saida, setSaida] = useState("Terminal Central");
  const [destino, setDestino] = useState("Bairro");

  const [paradas, setParadas] = useState([
    "Terminal Central",
    "Av. Central",
    "Shopping Central",
    "Av. Paulista",
  ]);

  function adicionarParada() {
    const nova = prompt("Digite o nome da nova parada:");
    if (nova) {
      setParadas([...paradas, nova]);
    }
  }

  function removerParada(index) {
    setParadas(paradas.filter((_, i) => i !== index));
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="h1">PAINEL ADMINISTRATIVO - ROTAS</h1>

        <button className="home-btn" onClick={() => window.location.href = "/"}>
          Home
        </button>
      </header>

      <div className="content">
        <div className="rota-card">

          {/* ESQUERDA - MAPA */}
          <div className="map-container">
            <div className="map">
                <iframe
                    src="https://www.google.com/maps/d/embed?mid=1CGlf7-SLTrBaj3BVrVExvLC0-2TCoW0"
                    width="100%"
                    height="500"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
          </div>

          {/* DIREITA - INFOS */}
          <div className="info-container">
            <h3>Editar Rota de Ônibus</h3>

            <label>Nome da Rota:</label>
            <input value={rota} onChange={(e) => setRota(e.target.value)} />

            <label>Saída:</label>
            <input value={saida} onChange={(e) => setSaida(e.target.value)} />

            <label>Destino:</label>
            <input value={destino} onChange={(e) => setDestino(e.target.value)} />

            <h4>Paradas:</h4>

            <ul className="lista">
              {paradas.map((p, index) => (
                <li key={index}>
                  {p}
                  <button onClick={() => removerParada(index)}>❌</button>
                </li>
              ))}
            </ul>

            <button className="btn-add" onClick={adicionarParada}>
              + Adicionar Parada
            </button>

            <div className="actions">
              <button className="cancelar">Cancelar</button>
              <button className="salvar">Salvar</button>
            </div>
          </div>

        </div>
      </div>

      <button className="footer-btn">Concluir</button>
    </div>
  );
}