import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { getCollection, updateCollection } from "../../mockup/localStorage";

export default function EditarRota() {
  const navigate = useNavigate();
  const [rotasDisponiveis, setRotasDisponiveis] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(0);
  const [rota, setRota] = useState("");
  const [saida, setSaida] = useState("");
  const [destino, setDestino] = useState("");
  const [mapa, setMapa] = useState("");
  const [paradas, setParadas] = useState([]);

  useEffect(() => {
    const rotas = getCollection("rotas");
    setRotasDisponiveis(rotas);
  }, []);

  useEffect(() => {
    const rotaEscolhida = rotasDisponiveis[rotaSelecionada];
    if (rotaEscolhida) {
      setRota(rotaEscolhida.nome);
      setSaida(rotaEscolhida.saida);
      setDestino(rotaEscolhida.destino);
      setMapa(rotaEscolhida.mapa);
      setParadas(rotaEscolhida.paradas);
    }
  }, [rotasDisponiveis, rotaSelecionada]);

  function trocarRota(index) {
    setRotaSelecionada(index);
  }

  function adicionarParada() {
    const nova = prompt("Digite o nome da nova parada:");

    if (nova) {
      const atualizadas = [...paradas, nova];
      setParadas(atualizadas);
      const novasRotas = rotasDisponiveis.map((item, index) =>
        index === rotaSelecionada ? { ...item, paradas: atualizadas } : item
      );
      setRotasDisponiveis(novasRotas);
    }
  }

  function removerParada(index) {
    const atualizadas = paradas.filter((_, i) => i !== index);
    setParadas(atualizadas);
    const novasRotas = rotasDisponiveis.map((item, idx) =>
      idx === rotaSelecionada ? { ...item, paradas: atualizadas } : item
    );
    setRotasDisponiveis(novasRotas);
  }

  function salvarRota() {
    const novasRotas = rotasDisponiveis.map((item, idx) =>
      idx === rotaSelecionada
        ? { ...item, nome: rota, saida, destino, paradas }
        : item
    );
    setRotasDisponiveis(novasRotas);
    updateCollection("rotas", novasRotas);
    alert("Rota salva com sucesso!");
  }

  return (
    <div className={styles.imagemFundo}>
      <div className={styles.header}>
        <h1 className={styles.titulinho}>
          PAINEL ADMINISTRATIVO - EDITAR ROTAS
        </h1>

        <button
          className={styles.button}
          onClick={() => navigate("/adm")}
        >
          VOLTAR
        </button>
      </div>

      <div className={styles.conteudo}>
        <div className={styles.ladoesquerdo}>
          <div className={styles.barraLateral}>
            <h3>Editar Rota de Ônibus</h3>

            <label>Selecionar Rota:</label>
            <select
              className={styles.select}
              value={rotaSelecionada}
              onChange={(e) => trocarRota(Number(e.target.value))}
            >
              {rotasDisponiveis.map((item, index) => (
                <option key={index} value={index}>
                  {item.nome}
                </option>
              ))}
            </select>

            <label>Nome da Rota:</label>
            <input
              value={rota}
              onChange={(e) => setRota(e.target.value)}
            />

            <label>Saída:</label>
            <input
              value={saida}
              onChange={(e) => setSaida(e.target.value)}
            />

            <label>Destino:</label>
            <input
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />

            <h4>Paradas:</h4>

            <ul className={styles.lista}>
              {paradas.map((p, index) => (
                <li key={index} className={styles.item}>
                  {p}

                  <button
                    className={styles.delete}
                    onClick={() => removerParada(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>

            <button
              className={styles.salvar}
              onClick={adicionarParada}
            >
              + Adicionar Parada
            </button>
          </div>
        </div>

        <div className={styles.ladoDireito}>
          <div className={styles.conteudoDireito}>
            <h3>Mapa da Rota</h3>

            <div className={styles.mapa}>
              <iframe
                src={mapa}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Mapa da Rota"
              />
            </div>

            <div className={styles.rodape}>
              <button className={styles.salvar} onClick={salvarRota}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}