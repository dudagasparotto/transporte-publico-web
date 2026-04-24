import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function EditarRota() {
  const navigate = useNavigate();

  // Agora sim: 4 rotas reais no select, sem esse surto de “101 Vila Nova”
  const rotasDisponiveis = [
    {
      nome: "Rota Roxa",
      saida: "Terminal Central",
      destino: "Bairro Roxo",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F&noprof=1",
      paradas: [
        "Terminal Central",
        "Av. Principal",
        "Mercado Central",
        "Bairro Roxo",
      ],
    },
    {
      nome: "Rota Azul",
      saida: "Terminal Norte",
      destino: "Bairro Azul",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F&noprof=1",
      paradas: [
        "Terminal Norte",
        "Praça Azul",
        "Hospital Municipal",
        "Bairro Azul",
      ],
    },
    {
      nome: "Rota Laranja",
      saida: "Terminal Sul",
      destino: "Bairro Laranja",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F&noprof=1",
      paradas: [
        "Terminal Sul",
        "Av. das Flores",
        "Shopping Sul",
        "Bairro Laranja",
      ],
    },
    {
      nome: "Rota Amarela",
      saida: "Rodoviária",
      destino: "Bairro Amarelo",
      mapa:
        "https://www.google.com/maps/d/u/1/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F&noprof=1",
      paradas: [
        "Rodoviária",
        "Centro",
        "Escola Municipal",
        "Bairro Amarelo",
      ],
    },
  ];

  const [rotaSelecionada, setRotaSelecionada] = useState(0);

  const [rota, setRota] = useState(rotasDisponiveis[0].nome);
  const [saida, setSaida] = useState(rotasDisponiveis[0].saida);
  const [destino, setDestino] = useState(rotasDisponiveis[0].destino);
  const [mapa, setMapa] = useState(rotasDisponiveis[0].mapa);
  const [paradas, setParadas] = useState(rotasDisponiveis[0].paradas);

  function trocarRota(index) {
    const rotaEscolhida = rotasDisponiveis[index];

    setRotaSelecionada(index);
    setRota(rotaEscolhida.nome);
    setSaida(rotaEscolhida.saida);
    setDestino(rotaEscolhida.destino);
    setMapa(rotaEscolhida.mapa);
    setParadas(rotaEscolhida.paradas);
  }

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
              <button className={styles.salvar}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}