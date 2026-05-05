import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { getCollection, updateCollection } from "../../mockup/localStorage";

export default function EditarPontos() {
  const navigate = useNavigate();
  const [rotasDisponiveis, setRotasDisponiveis] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(0);
  const [mapa, setMapa] = useState("");

  const [pontos, setPontos] = useState([]);
  const [todosPontos, setTodosPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [sentido, setSentido] = useState("Bairro");
  const [localizacao, setLocalizacao] = useState("");

  useEffect(() => {
    const rotas = getCollection("rotas");
    setRotasDisponiveis(rotas);
  }, []);

  useEffect(() => {
    const allPontos = getCollection("pontos");
    setTodosPontos(allPontos);
  }, []);

  useEffect(() => {
    const rota = rotasDisponiveis[rotaSelecionada];
    if (rota) {
      setMapa(rota.mapa);
      setPontos(todosPontos.filter((ponto) => ponto.rotaId === rota.id));
    }
  }, [rotasDisponiveis, rotaSelecionada, todosPontos]);

  function trocarRota(index) {
    setRotaSelecionada(index);
  }

  function adicionarPonto() {
    if (!nome || !localizacao) {
      alert("Preencha nome e localização para adicionar o ponto.");
      return;
    }

    const rota = rotasDisponiveis[rotaSelecionada];
    if (!rota) return;

    const novoPonto = {
      id: Math.max(0, ...todosPontos.map((p) => p.id || 0)) + 1,
      nome,
      sentido,
      localizacao,
      rotaId: rota.id,
      rota: rota.nome,
    };

    const atualizados = [...todosPontos, novoPonto];
    setTodosPontos(atualizados);
    updateCollection("pontos", atualizados);
    setNome("");
    setLocalizacao("");
  }

  return (
    <div className={styles.imagemFundo}>
      <div className={styles.header}>
        <h1 className={styles.titulinho}>
          PAINEL ADMINISTRATIVO - EDITAR PONTOS
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
            <h3>Editar Ponto de Ônibus</h3>

            <label>Selecionar Rota:</label>
            <select
              value={rotaSelecionada}
              onChange={(e) => trocarRota(Number(e.target.value))}
            >
              {rotasDisponiveis.map((rota, index) => (
                <option key={index} value={index}>
                  {rota.nome}
                </option>
              ))}
            </select>

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

            <button
              className={styles.salvar}
              onClick={adicionarPonto}
            >
              Adicionar Ponto
            </button>
          </div>
        </div>

        <div className={styles.ladoDireito}>
          <div className={styles.conteudoDireito}>
            <h3>Pontos cadastrados</h3>

            <div className={styles.mapa}>
              <iframe
                src={mapa}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Mapa de Pontos"
              />
            </div>

            <div className={styles.tabelaContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Sentido</th>
                    <th>Localização</th>
                    <th>Rota</th>
                    <th>Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {pontos.map((ponto, index) => (
                    <tr key={index}>
                      <td>{ponto.nome}</td>
                      <td>{ponto.sentido}</td>
                      <td>{ponto.localizacao}</td>
                      <td>{ponto.rota}</td>
                      <td>
                        <button className={styles.delete}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.rodape}>
              <button className={styles.salvar}>
                Concluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}