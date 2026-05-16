import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function EditarHorarios() {

  const navigate = useNavigate();

  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);

  useEffect(() => {
    carregarRotas();
  }, []);

  async function carregarRotas() {

    try {

      const response = await fetch(
        "http://localhost:3333/rotas-com-pontos"
      );

      const data = await response.json();

      if (data.sucesso) {
        setRotas(data.dados);

        if (data.dados.length > 0) {
          setRotaSelecionada(data.dados[0].id_linha);
        }
      }

    } catch (error) {

      console.error(
        "Erro ao carregar rotas:",
        error
      );

    }

  }

  function alterarHorario(
    pontoId,
    indexHorario,
    valor
  ) {

    const copia = [...rotas];

    const rotaIndex = copia.findIndex(
      (r) => r.id_linha === rotaSelecionada
    );

    const pontoIndex = copia[
      rotaIndex
    ].pontos.findIndex(
      (p) => p.id_ponto === pontoId
    );

    copia[rotaIndex]
      .pontos[pontoIndex]
      .horarios[indexHorario] = valor;

    setRotas(copia);

  }

  function adicionarHorario(
    pontoId
  ) {

    const copia = [...rotas];

    const rotaIndex = copia.findIndex(
      (r) => r.id_linha === rotaSelecionada
    );

    const pontoIndex = copia[
      rotaIndex
    ].pontos.findIndex(
      (p) => p.id_ponto === pontoId
    );

    copia[rotaIndex]
      .pontos[pontoIndex]
      .horarios.push("");

    setRotas(copia);

  }

  async function salvarHorarios() {

    try {

      const rotaAtual = rotas.find(
        (r) => r.id_linha === rotaSelecionada
      );

      const response = await fetch(
        "http://localhost:3333/salvar-horarios",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            pontos: rotaAtual.pontos,
          }),
        }
      );

      const data = await response.json();

      if (data.sucesso) {

        alert(
          "Horários salvos com sucesso!"
        );

      } else {

        alert(
          "Erro ao salvar horários."
        );

      }

    } catch (error) {

      console.error(
        "Erro ao salvar:",
        error
      );

    }

  }

  const rotaAtual = rotas.find(
    (r) => r.id_linha === rotaSelecionada
  );

  return (

    <div className={styles.imagemFundo}>

      <div className={styles.overlay} />

      <div className={styles.header}>

        <h1 className={styles.titulo}>
          PAINEL ADMINISTRATIVO - EDITAR HORÁRIOS
        </h1>

        <button
          className={styles.botaoVoltar}
          onClick={() =>
            navigate("/adm")
          }
        >
          VOLTAR
        </button>

      </div>

      <div className={styles.container}>

        <div className={styles.card}>

          <div className={styles.topoCard}>

            <div>

              <h2 className={styles.subtitulo}>
                Gerenciar Horários
              </h2>

              <p className={styles.descricao}>
                Selecione uma rota e
                edite os horários dos
                pontos.
              </p>

            </div>

            <button
              className={styles.salvar}
              onClick={salvarHorarios}
            >
              SALVAR HORÁRIOS
            </button>

          </div>

          <div className={styles.rotas}>

            {rotas.map((rota) => (

              <button
                key={rota.id_linha}
                className={`${
                  styles.botaoRota
                } ${
                  rotaSelecionada ===
                  rota.id_linha
                    ? styles.ativo
                    : ""
                }`}
                onClick={() =>
                  setRotaSelecionada(
                    rota.id_linha
                  )
                }
              >
                {rota.nome_linha}
              </button>

            ))}

          </div>

          <div className={styles.listaPontos}>

            {rotaAtual?.pontos?.map(
              (ponto) => (

                <div
                  key={ponto.id_ponto}
                  className={
                    styles.cardPonto
                  }
                >

                  <div
                    className={
                      styles.infoPonto
                    }
                  >

                    <h3>
                      {ponto.nome_ponto}
                    </h3>

                    <span>
                      {ponto.localizacao}
                    </span>

                  </div>

                  <div
                    className={
                      styles.horarios
                    }
                  >

                    {ponto.horarios.map(
                      (
                        horario,
                        index
                      ) => (

                        <input
                          key={index}
                          type="time"
                          value={horario}
                          className={
                            styles.inputHora
                          }
                          onChange={(e) =>
                            alterarHorario(
                              ponto.id_ponto,
                              index,
                              e.target
                                .value
                            )
                          }
                        />

                      )
                    )}

                    <button
                      className={
                        styles.adicionar
                      }
                      onClick={() =>
                        adicionarHorario(
                          ponto.id_ponto
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );

}