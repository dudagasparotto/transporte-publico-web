import { useState } from "react";
import "./styles.css";

export default function EditarPontos() {
  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [sentido, setSentido] = useState("Bairro");
  const [localizacao, setLocalizacao] = useState("");

  function adicionarPonto() {
    if (!nome || !localizacao) return;

    const novoPonto = {
      nome,
      sentido,
      localizacao,
    };

    setPontos([...pontos, novoPonto]);

    setNome("");
    setLocalizacao("");
  }

  return (
    <div className="container">
      <header className="header">
        PAINEL ADMINISTRATIVO - PONTOS DE ÔNIBUS
      </header>

      <div className="content">
        {/* ESQUERDA */}
        <div className="card">
          <h3>Ponto de Ônibus</h3>

          <label>Nome do Ponto:</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Av. Central"
          />

          <label>Sentido:</label>
          <select
            value={sentido}
            onChange={(e) => setSentido(e.target.value)}
          >
            <option>Bairro</option>
            <option>Centro</option>
          </select>

          <label>Localização:</label>
          <input
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Rua Principal, 321"
          />

          <button onClick={adicionarPonto} className="btn">
            Editar Ponto
          </button>
        </div>

        {/* DIREITA */}
        <div className="right">
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

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Sentido</th>
                <th>Localização</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((ponto, index) => (
                <tr key={index}>
                  <td>{ponto.nome}</td>
                  <td>{ponto.sentido}</td>
                  <td>{ponto.localizacao}</td>
                  <td>
                    <button>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="footer-btn">Concluir</button>
    </div>
  );
}