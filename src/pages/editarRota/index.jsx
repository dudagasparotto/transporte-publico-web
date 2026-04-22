import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function EditarRota() {
  const navigate = useNavigate();
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
    <div className={styles.imagemFundo}>
      <div className={styles.header}>
        <h1 className={styles.titulinho}>PAINEL ADMINISTRATIVO - EDITAR ROTAS</h1>

        <button className={styles.button} onClick={() => navigate("/adm")}>VOLTAR</button>
      </div>

      <div className={styles.conteudo}>
        <div className={styles.ladoesquerdo}>
          <div className={styles.barraLateral}>
            <h3>Editar Rota de Ônibus</h3>

            <label>Nome da Rota:</label>
            <input value={rota} onChange={(e) => setRota(e.target.value)} />

            <label>Saída:</label>
            <input value={saida} onChange={(e) => setSaida(e.target.value)} />

            <label>Destino:</label>
            <input value={destino} onChange={(e) => setDestino(e.target.value)} />

            <h4>Paradas:</h4>
            <ul className={styles.lista}>
              {paradas.map((p, index) => (
                <li key={index} className={styles.item}>
                  {p}
                  <button className={styles.delete} onClick={() => removerParada(index)}>X</button>
                </li>
              ))}
            </ul>

            <button className={styles.salvar} onClick={adicionarParada}>
              + Adicionar Parada
            </button>
          </div>
        </div>

        <div className={styles.ladoDireito}>
          <div className={styles.conteudoDireito}>
            <h3>Mapa da Rota</h3>

            <div className={styles.mapa}>
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1CGlf7-SLTrBaj3BVrVExvLC0-2TCoW0"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Mapa da Rota"
              ></iframe>
            </div>

            <div className={styles.rodape}>
              <button className={styles.salvar}>Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}