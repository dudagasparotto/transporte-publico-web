import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/apis";
import { listarRotasComPontos } from "../../services/transporte";
import styles from "./styles.module.css";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

export default function EditarHorarios() {

  const navigate = useNavigate();
  const { alert, confirm } = useAppDialog();

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
          .filter((ponto) => !ponto.id_rota && !pontosVinculados.includes(ponto.id_pontos))
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
        horarios: ponto.horarios.map((horario) => ({ ...horario })),
      })),
    }));
  }

  function encontrarPonto(copia, pontoId) {
    const rotaIndex = copia.findIndex(
      (rota) => rota.id_linha === rotaSelecionada
    );

    if (rotaIndex < 0) return null;

    const pontoIndex = copia[rotaIndex].pontos.findIndex(
      (ponto) => ponto.id_ponto === pontoId
    );

    if (pontoIndex < 0) return null;

    return { rotaIndex, pontoIndex };
  }

  function alterarHorario(pontoId, indexHorario, valor) {
    const copia = copiarRotas();
    const posicao = encontrarPonto(copia, pontoId);

    if (!posicao) return;

    copia[posicao.rotaIndex].pontos[posicao.pontoIndex].horarios[indexHorario] = {
      ...copia[posicao.rotaIndex].pontos[posicao.pontoIndex].horarios[indexHorario],
      hora: valor,
    };

    setRotas(copia);
  }

  function adicionarHorario(pontoId) {
    const copia = copiarRotas();
    const posicao = encontrarPonto(copia, pontoId);

    if (!posicao) return;

    copia[posicao.rotaIndex].pontos[posicao.pontoIndex].horarios.push({
      id_horario: null,
      hora: "",
    });

    setRotas(copia);
  }

  async function excluirHorario(pontoId, horario, indexHorario) {
    const confirmou = await confirm({
      title: "Excluir horário",
      message: "Deseja excluir este horário?",
      confirmLabel: "Excluir",
      variant: "danger",
    });

    if (!confirmou) return;

    if (horario.id_horario) {
      try {
        await api.delete(`/horarios/${horario.id_horario}`);
      } catch (error) {
        console.error("Erro ao excluir horário:", error);
        await alert(
          error.response?.data?.mensagem ||
          "Erro ao excluir horário."
        );
        return;
      }
    }

    const copia = copiarRotas();
    const posicao = encontrarPonto(copia, pontoId);

    if (!posicao) return;

    copia[posicao.rotaIndex].pontos[posicao.pontoIndex].horarios.splice(indexHorario, 1);
    setRotas(copia);
  }

  function selecionarRota(idLinha) {
    setRotaSelecionada(idLinha);
    setPontoEditando(null);
  }

  async function salvarHorarios(ponto) {
    try {
      const horariosValidos = ponto.horarios.filter((horario) => horario.hora);

      for (const horario of horariosValidos) {
        if (horario.id_horario) {
          await api.patch(`/horarios/${horario.id_horario}`, {
            id_ponto: ponto.id_ponto,
            passagem_horarios: horario.hora,
          });
        } else {
          const { data } = await api.post("/horarios", {
            id_ponto: ponto.id_ponto,
            passagem_horarios: horario.hora,
          });

          horario.id_horario = data.dados?.id_horario;
        }
      }

      setRotas(copiarRotas());
      await alert("Horários salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
      await alert(
        error.response?.data?.mensagem ||
        "Não foi possível salvar os horários."
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
                Editar horários
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

                            <div
                              key={index}
                              className={styles.horarioItem}
                            >

                              <input
                                type="time"
                                value={horario.hora}
                                className={styles.inputHora}
                                onChange={(e) =>
                                  alterarHorario(
                                    ponto.id_ponto,
                                    index,
                                    e.target.value
                                  )
                                }
                              />

                              <button
                                className={styles.excluirHorario}
                                onClick={() =>
                                  excluirHorario(
                                    ponto.id_ponto,
                                    horario,
                                    index
                                  )
                                }
                              >
                                X
                              </button>

                            </div>

                          ))
                        ) : (
                          <span className={styles.semHorario}>
                            Nenhum horário cadastrado.
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
