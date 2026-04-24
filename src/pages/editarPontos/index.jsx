import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

export default function EditarPontos() {
  const navigate = useNavigate();

  // mesmas 4 rotas porque consistência é raro mas bonito
  const rotasDisponiveis = [
    {
      nome: "Rota Roxa",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F&noprof=1",
    },
    {
      nome: "Rota Azul",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F&noprof=1",
    },
    {
      nome: "Rota Laranja",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F&noprof=1",
    },
    {
      nome: "Rota Amarela",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F&noprof=1",
    },
  ];

  const [rotaSelecionada, setRotaSelecionada] = useState(0);
  const [mapa, setMapa] = useState(rotasDisponiveis[0].mapa);

  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [sentido, setSentido] = useState("Bairro");
  const [localizacao, setLocalizacao] = useState("");

  function trocarRota(index) {
    setRotaSelecionada(index);
    setMapa(rotasDisponiveis[index].mapa);
  }

  function adicionarPonto() {
    if (!nome || !localizacao) return;

    const novoPonto = {
      nome,
      sentido,
      localizacao,
      rota: rotasDisponiveis[rotaSelecionada].nome,
    };

    setPontos([...pontos, novoPonto]);
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