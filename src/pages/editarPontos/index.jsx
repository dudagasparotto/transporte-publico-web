import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

export default function EditarPontos() {
  const navigate = useNavigate();
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
    <div className={styles.imagemFundo}>
      <div className={styles.header}>
        <h1 className={styles.titulinho}>PAINEL ADMINISTRATIVO - EDITAR PONTOS</h1>

        <button className={styles.button} onClick={() => navigate("/adm")}>VOLTAR</button>
      </div>

      <div className={styles.conteudo}>
        <div className={styles.ladoesquerdo}>
          <div className={styles.barraLateral}>
            <h3>Editar Ponto de Ônibus</h3>

            <label>Nome do Ponto:</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Av. Central"
            />

            <label>Sentido:</label>
            <select value={sentido} onChange={(e) => setSentido(e.target.value)}>
              <option>Bairro</option>
              <option>Centro</option>
            </select>

            <label>Localização:</label>
            <input
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder="Rua Principal, 321"
            />

            <button className={styles.salvar} onClick={adicionarPonto}>
              Adicionar Ponto
            </button>
          </div>
        </div>

        <div className={styles.ladoDireito}>
          <div className={styles.conteudoDireito}>
            <h3>Pontos cadastrados</h3>

            <div className={styles.mapa}>
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1CGlf7-SLTrBaj3BVrVExvLC0-2TCoW0"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Mapa de Pontos"
              ></iframe>
            </div>

            <div className={styles.tabelaContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Sentido</th>
                    <th>Localização</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {pontos.map((ponto, index) => (
                    <tr key={index}>
                      <td>{ponto.nome}</td>
                      <td>{ponto.sentido}</td>
                      <td>{ponto.localizacao}</td>
                      <td>
                        <button className={styles.delete}>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.rodape}>
              <button className={styles.salvar}>Concluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
