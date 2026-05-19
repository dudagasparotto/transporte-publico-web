import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/apis";
import { listarRotasComPontos } from "../../services/transporte";
import styles from "./styles.module.css";

export default function EditarHorarios() {

  const navigate = useNavigate();

  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [pontoEditando, setPontoEditando] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const rotasComPontos = await listarRotasComPontos();
        const { data: pontosData } = await api.get("/pontos");

        const pontosVinculados = rotasComPontos.flatMap((rota) =>
          rota.pontos.map((ponto) => ponto.id_ponto)
        );

        const pontosSemRota = (pontosData.dados || [])
          .filter((ponto) => !pontosVinculados.includes(ponto.id_pontos))
          .map((ponto) => ({
            id_ponto: ponto.id_pontos,
            nome_ponto: ponto.nome_pontos,
            localizacao: `${ponto.latitude_pontos}, ${ponto.longitude_pontos}`,
            horarios: [],
          }));

        const dados = pontosSemRota.length > 0
          ? [
              ...rotasComPontos,
              {
                id_linha: "sem-rota",
                nome_linha: "SEM ROTA",
                cor: "#64748B",
                pontos: pontosSemRota,
              },
            ]
          : rotasComPontos;

        setRotas(dados);

        if (dados.length > 0) {
          setRotaSelecionada(dados[0].id_linha);
        }
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
      }
    }

    carregarDados();
  }, []);

  function copiarRotas() {
    return rotas.map((rota) => ({
      ...rota,
      pontos: rota.pontos.map((ponto) => ({
        ...ponto,
        horarios: [...ponto.horarios],
      })),
    }));
  }

  function alterarHorario(pontoId, indexHorario, valor) {
    const copia = copiarRotas();

    const rotaIndex = copia.findIndex(
      (rota) => rota.id_linha === rotaSelecionada
    );

    if (rotaIndex < 0) return;

    const pontoIndex = copia[rotaIndex].pontos.findIndex(
      (ponto) => ponto.id_ponto === pontoId
    );

    if (pontoIndex < 0) return;

    copia[rotaIndex].pontos[pontoIndex].horarios[indexHorario] = valor;
    setRotas(copia);
  }

  function adicionarHorario(pontoId) {
    const copia = copiarRotas();

    const rotaIndex = copia.findIndex(
      (rota) => rota.id_linha === rotaSelecionada
    );

    if (rotaIndex < 0) return;

    const pontoIndex = copia[rotaIndex].pontos.findIndex(
      (ponto) => ponto.id_ponto === pontoId
    );

    if (pontoIndex < 0) return;

    copia[rotaIndex].pontos[pontoIndex].horarios.push("");
    setRotas(copia);
  }

  function selecionarRota(idLinha) {
    setRotaSelecionada(idLinha);
    setPontoEditando(null);
  }

  async function salvarHorarios(ponto) {
    try {
      const horariosValidos = ponto.horarios.filter(Boolean);

      const { data } = await api.post("/salvar-horarios", {
        id_ponto: ponto.id_ponto,
        horarios: horariosValidos,
      });

      if (data.sucesso) {
        alert("Horários salvos com sucesso!");
      } else {
        alert(data.mensagem || "Erro ao salvar horários.");
      }
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
      alert(
        error.response?.data?.mensagem ||
        "Não foi possível salvar. Verifique se o backend possui a rota /salvar-horarios."
      );
    }
  }

  const rotaAtual = rotas.find(
    (rota) => rota.id_linha === rotaSelecionada
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
          onClick={() => navigate("/adm")}
        >
          VOLTAR
        </button>

      </div>

      <div className={styles.container}>

        <div className={styles.card}>

          <div className={styles.topoCard}>

            <div>

              <h2 className={styles.subtitulo}>
                Editar Horários
              </h2>

              <p className={styles.descricao}>
                Selecione uma rota para ver os pontos e editar os horários.
              </p>

            </div>

          </div>

          <div className={styles.rotas}>

            {rotas.map((rota) => (

              <button
                key={rota.id_linha}
                className={`${styles.botaoRota} ${
                  rotaSelecionada === rota.id_linha
                    ? styles.ativo
                    : ""
                }`}
                style={{
                  background:
                    rotaSelecionada === rota.id_linha
                      ? rota.cor
                      : "#6B7280",
                }}
                onClick={() => selecionarRota(rota.id_linha)}
              >
                {rota.nome_linha}
              </button>

            ))}

          </div>

          <div className={styles.listaPontos}>

            {rotaAtual?.pontos?.length > 0 ? (
              rotaAtual.pontos.map((ponto) => (

                <div
                  key={ponto.id_ponto}
                  className={styles.cardPonto}
                >

                  <div className={styles.infoPonto}>

                    <h3>{ponto.nome_ponto}</h3>

                    <span>{ponto.localizacao}</span>

                  </div>

                  <button
                    className={styles.botaoEditar}
                    onClick={() =>
                      setPontoEditando(
                        pontoEditando === ponto.id_ponto
                          ? null
                          : ponto.id_ponto
                      )
                    }
                  >
                    {pontoEditando === ponto.id_ponto
                      ? "FECHAR"
                      : "EDITAR HORÁRIOS"}
                  </button>

                  {pontoEditando === ponto.id_ponto && (

                    <div className={styles.editorHorarios}>

                      <div className={styles.horarios}>

                        {ponto.horarios.length > 0 ? (
                          ponto.horarios.map((horario, index) => (

                            <input
                              key={index}
                              type="time"
                              value={horario}
                              className={styles.inputHora}
                              onChange={(e) =>
                                alterarHorario(
                                  ponto.id_ponto,
                                  index,
                                  e.target.value
                                )
                              }
                            />

                          ))
                        ) : (
                          <span className={styles.semHorario}>
                            Nenhum horário cadastrado
                          </span>
                        )}

                        <button
                          className={styles.adicionar}
                          onClick={() =>
                            adicionarHorario(ponto.id_ponto)
                          }
                        >
                          +
                        </button>

                      </div>

                      <button
                        className={styles.salvar}
                        onClick={() => salvarHorarios(ponto)}
                      >
                        SALVAR HORÁRIOS
                      </button>

                    </div>

                  )}

                </div>

              ))
            ) : (
              <p className={styles.semPonto}>
                Nenhum ponto cadastrado para esta rota.
              </p>
            )}

          </div>

        </div>

      </div>

    </div>

  );

}
