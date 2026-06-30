import { useEffect, useState } from "react";
import {
  Eraser,
  MapPin,
  Plus,
  Route,
  Save,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./styles.module.css";
import api from "../../services/apis";
import { listarRotasComPontos } from "../../services/transporte";
import LeafletRouteMap from "../../components/LeafletRouteMap";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

const CORES_DE_ROTA = [
  { nome: "VERMELHA", valor: "#DC2626" },
  { nome: "VERDE", valor: "#16A34A" },
  { nome: "AZUL", valor: "#2563EB" },
  { nome: "AMARELA", valor: "#EAB308" },
  { nome: "LARANJA", valor: "#EA580C" },
  { nome: "ROXA", valor: "#7C3AED" },
  { nome: "ROSA", valor: "#DB2777" },
  { nome: "MARROM", valor: "#92400E" },
  { nome: "CINZA", valor: "#6B7280" },
  { nome: "PRETA", valor: "#111827" },
];

function obterCorDaRota(rota) {
  const nome = rota?.nome_linha?.trim().toUpperCase();
  const corDoNome = CORES_DE_ROTA.find((cor) => cor.nome === nome);

  return corDoNome?.valor || rota?.cor || "#6B7280";
}

export default function EditarRota() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alert, confirm } = useAppDialog();
  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [nomeLinha, setNomeLinha] = useState("");
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [nomePonto, setNomePonto] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modalCadastroAberto, setModalCadastroAberto] = useState(
    Boolean(location.state?.abrirCadastro)
  );
  const [nomeNovaRota, setNomeNovaRota] = useState("");
  const [cadastrandoRota, setCadastrandoRota] = useState(false);
  const [editandoTrajeto, setEditandoTrajeto] = useState(false);
  const [trajetoEmEdicao, setTrajetoEmEdicao] = useState([]);
  const [salvandoTrajeto, setSalvandoTrajeto] = useState(false);

  useEffect(() => {
    async function iniciarEdicao() {
      try {
        const dados = await listarRotasComPontos();
        setRotas(dados);
        setRotaSelecionada(dados[0] || null);
        setNomeLinha(dados[0]?.nome_linha || "");
      } catch (error) {
        console.error("Erro ao carregar rotas:", error);
      }
    }
    

    iniciarEdicao();
  }, []);

  async function recarregarRota(idLinha, idPonto) {
    const dados = await listarRotasComPontos();
    const rotaAtual =
      dados.find((rota) => rota.id_linha === idLinha) || dados[0] || null;

    setRotas(dados);
    setRotaSelecionada(rotaAtual);
    setNomeLinha(rotaAtual?.nome_linha || "");

    const pontoAtual = rotaAtual?.pontos.find(
      (ponto) => ponto.id_ponto === idPonto
    );

    if (pontoAtual) {
      selecionarPonto(pontoAtual);
    }
  }

  function selecionarRota(rota) {
    setRotaSelecionada(rota);
    setNomeLinha(rota.nome_linha);
    setEditandoTrajeto(false);
    setTrajetoEmEdicao([]);
    setPontoSelecionado(null);
    setNomePonto("");
    setLatitude("");
    setLongitude("");
    setMensagem("");
  }

  function selecionarPonto(ponto) {
    setPontoSelecionado(ponto);
    setNomePonto(ponto.nome_ponto);
    setLatitude(String(ponto.latitude));
    setLongitude(String(ponto.longitude));
    setMensagem("Arraste o marcador ou clique no mapa para mudar a posição.");
  }

  function alterarPontoNoMapa(ponto, local) {
    const latitudeNova = local.latitude.toFixed(8);
    const longitudeNova = local.longitude.toFixed(8);
    const pontoAtualizado = {
      ...ponto,
      latitude: latitudeNova,
      longitude: longitudeNova,
      localizacao: `${latitudeNova}, ${longitudeNova}`,
    };

    setPontoSelecionado(pontoAtualizado);
    setNomePonto(pontoAtualizado.nome_ponto);
    setLatitude(latitudeNova);
    setLongitude(longitudeNova);
    setRotaSelecionada((rotaAtual) => ({
      ...rotaAtual,
      pontos: rotaAtual.pontos.map((item) =>
        item.id_ponto === pontoAtualizado.id_ponto ? pontoAtualizado : item
      ),
    }));
    setMensagem("Posição alterada. Clique em salvar ponto.");
  }

  function selecionarLocal(local) {
    if (pontoSelecionado) {
      alterarPontoNoMapa(pontoSelecionado, local);
    }
  }

  async function iniciarDesenhoTrajeto() {
    if (!rotaSelecionada?.id_rota) {
      await alert("Selecione uma rota válida para desenhar o trajeto.");
      return;
    }

    setPontoSelecionado(null);
    setNomePonto("");
    setLatitude("");
    setLongitude("");
    setTrajetoEmEdicao(
      (rotaSelecionada.trajeto || []).map((ponto) => [...ponto])
    );
    setEditandoTrajeto(true);
    setMensagem(
      "Clique no mapa em sequência para desenhar a linha do trajeto."
    );
  }

  function adicionarPontoAoTrajeto(local) {
    setTrajetoEmEdicao((trajetoAtual) => [
      ...trajetoAtual,
      [
        Number(local.latitude.toFixed(8)),
        Number(local.longitude.toFixed(8)),
      ],
    ]);
  }

  function desfazerPontoDoTrajeto() {
    setTrajetoEmEdicao((trajetoAtual) => trajetoAtual.slice(0, -1));
  }

  function limparTrajeto() {
    setTrajetoEmEdicao([]);
  }

  function cancelarEdicaoTrajeto() {
    setEditandoTrajeto(false);
    setTrajetoEmEdicao([]);
    setMensagem("");
  }

  async function salvarTrajeto() {
    if (!rotaSelecionada?.id_rota) {
      await alert("Selecione uma rota válida para salvar o trajeto.");
      return;
    }

    if (trajetoEmEdicao.length < 2) {
      await alert("Marque pelo menos dois pontos para formar a linha.");
      return;
    }

    try {
      setSalvandoTrajeto(true);

      const { data } = await api.patch(
        `/rotas/${rotaSelecionada.id_rota}`,
        {
          trajeto: trajetoEmEdicao,
        }
      );

      if (data.sucesso === false) {
        await alert(data.mensagem || "Erro ao salvar trajeto.");
        return;
      }

      await recarregarRota(rotaSelecionada.id_linha);
      setEditandoTrajeto(false);
      setTrajetoEmEdicao([]);
      setMensagem("Trajeto salvo com sucesso.");
      await alert("Trajeto salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar trajeto:", error);
      await alert(error.response?.data?.mensagem || "Erro ao salvar trajeto.");
    } finally {
      setSalvandoTrajeto(false);
    }
  }

  async function salvarLinha() {
    if (!rotaSelecionada || !nomeLinha.trim()) {
      await alert("Informe o nome da linha.");
      return;
    }

    try {
      const { data } = await api.patch(`/linhas/${rotaSelecionada.id_linha}`, {
        nome_linhas: nomeLinha.trim(),
        nome_da_linha: nomeLinha.trim(),
      });

      if (!data.sucesso) {
        await alert(data.mensagem || "Erro ao atualizar linha.");
        return;
      }

      await recarregarRota(rotaSelecionada.id_linha, pontoSelecionado?.id_ponto);
      setMensagem("Nome da linha salvo com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar linha:", error);
      await alert(error.response?.data?.mensagem || "Erro ao atualizar linha.");
    }
  }

  function fecharModalCadastro() {
    if (cadastrandoRota) return;

    setModalCadastroAberto(false);
    setNomeNovaRota("");
  }

  async function cadastrarRota(event) {
    event.preventDefault();

    const corSelecionada = CORES_DE_ROTA.find(
      (cor) => cor.nome === nomeNovaRota
    );

    if (!corSelecionada) {
      await alert("Selecione uma cor para identificar a rota.");
      return;
    }

    let idLinhaCriada = null;

    try {
      setCadastrandoRota(true);

      const linhaResponse = await api.post("/linhas", {
        nome_da_linha: corSelecionada.nome,
      });

      if (!linhaResponse.data.sucesso) {
        throw new Error(
          linhaResponse.data.mensagem || "Erro ao cadastrar linha."
        );
      }

      idLinhaCriada = linhaResponse.data.dados?.id;

      const rotaResponse = await api.post("/rotas", {
        id_da_Linha: idLinhaCriada,
        cor: corSelecionada.valor,
      });

      if (!rotaResponse.data.sucesso) {
        throw new Error(
          rotaResponse.data.mensagem || "Erro ao cadastrar rota."
        );
      }

      await recarregarRota(idLinhaCriada);
      setModalCadastroAberto(false);
      setNomeNovaRota("");
      setMensagem("Rota cadastrada com sucesso.");
      await alert("Rota cadastrada com sucesso!");
    } catch (error) {
      if (idLinhaCriada) {
        try {
          await api.delete(`/linhas/${idLinhaCriada}`);
        } catch (rollbackError) {
          console.error("Erro ao desfazer cadastro da linha:", rollbackError);
        }
      }

      console.error("Erro ao cadastrar rota:", error);
      await alert(
        error.response?.data?.mensagem ||
          error.message ||
          "Não foi possível cadastrar a rota."
      );
    } finally {
      setCadastrandoRota(false);
    }
  }

  async function salvarPonto() {
    if (!pontoSelecionado || !nomePonto || !latitude || !longitude) {
      await alert("Escolha um ponto no mapa ou na lista.");
      return;
    }

    try {
      const { data } = await api.patch(`/pontos/${pontoSelecionado.id_ponto}`, {
        nome_pontos: nomePonto,
        nome_dos_pontos: nomePonto,
        latitude_pontos: Number(latitude),
        latitude_dos_pontos: Number(latitude),
        longitude_pontos: Number(longitude),
        longitude_dos_pontos: Number(longitude),
        id_rota: rotaSelecionada.id_rota,
      });

      if (!data.sucesso) {
        await alert(data.mensagem || "Erro ao atualizar ponto.");
        return;
      }

      await recarregarRota(rotaSelecionada.id_linha, pontoSelecionado.id_ponto);
      setMensagem("Ponto salvo. O trajeto foi atualizado no mapa.");
    } catch (error) {
      console.error("Erro ao atualizar ponto:", error);
      await alert(error.response?.data?.mensagem || "Erro ao atualizar ponto.");
    }
  }

  async function excluirRota() {
    if (!rotaSelecionada?.id_linha) {
      await alert("Selecione uma rota válida para excluir.");
      return;
    }

    const confirmou = await confirm({
      title: "Excluir rota",
      message: `Deseja excluir a rota "${rotaSelecionada.nome_linha}"?`,
      confirmLabel: "Excluir",
      variant: "danger",
    });

    if (!confirmou) return;

    try {
      if (rotaSelecionada.id_rota) {
        const { data: dadosRota } = await api.delete(
          `/rotas/${rotaSelecionada.id_rota}`
        );

        if (dadosRota.sucesso === false) {
          await alert(dadosRota.mensagem || "Erro ao excluir rota.");
          return;
        }
      }

      const { data: dadosLinha } = await api.delete(
        `/linhas/${rotaSelecionada.id_linha}`
      );

      if (dadosLinha.sucesso === false) {
        await alert(dadosLinha.mensagem || "Erro ao excluir linha da rota.");
        return;
      }

      const dados = await listarRotasComPontos();
      setRotas(dados);
      setRotaSelecionada(dados[0] || null);
      setNomeLinha(dados[0]?.nome_linha || "");
      setPontoSelecionado(null);
      setNomePonto("");
      setLatitude("");
      setLongitude("");
      setMensagem("");
      await alert("Rota excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir rota:", error);
      await alert(
        error.response?.data?.mensagem ||
          "Erro ao excluir rota. Verifique se a migração pontos_rota_delete_set_null.sql foi aplicada no banco."
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <header className={styles.header}>
        <h1 className={styles.titulo}>PAINEL ADMINISTRATIVO - EDITAR ROTAS</h1>

        <button className={styles.botaoVoltar} onClick={() => navigate("/adm")}>
          VOLTAR
        </button>
      </header>

      <main className={styles.card}>
        <div className={styles.topo}>
          <div>
            <h2 className={styles.subtitulo}>Rotas e linhas</h2>
            <p className={styles.descricao}>
              Selecione uma linha e ajuste os pontos diretamente no mapa.
            </p>
          </div>

          <div className={styles.acoesRota}>
            <button
              className={styles.cadastrarRota}
              onClick={() => setModalCadastroAberto(true)}
            >
              <Plus size={18} />
              CADASTRAR ROTA
            </button>

            <button
              className={styles.excluirRota}
              onClick={excluirRota}
              disabled={!rotaSelecionada?.id_linha}
            >
              <Trash2 size={18} />
              EXCLUIR ROTA
            </button>
          </div>
        </div>

        <div className={styles.botoesRotas}>
          {rotas.map((rota) => (
            <button
              key={rota.id_linha}
              className={`${styles.botaoRota} ${
                rotaSelecionada?.id_linha === rota.id_linha ? styles.ativo : ""
              }`}
              style={{
                "--cor-rota": obterCorDaRota(rota),
              }}
              onClick={() => selecionarRota(rota)}
            >
              {rota.nome_linha}
            </button>
          ))}
        </div>

        <div className={styles.conteudoEdicao}>
          <div className={styles.areaMapa}>
            {editandoTrajeto && (
              <div className={styles.avisoDesenho}>
                <Route size={18} />
                Clique no mapa seguindo as ruas para formar a linha.
              </div>
            )}
            <LeafletRouteMap
              rotaNome={rotaSelecionada?.nome_mapa}
              pontos={rotaSelecionada?.pontos || []}
              trajeto={
                editandoTrajeto
                  ? trajetoEmEdicao
                  : rotaSelecionada?.trajeto || []
              }
              editandoTrajeto={editandoTrajeto}
              corTrajeto={rotaSelecionada?.cor}
              onAdicionarPontoTrajeto={
                editandoTrajeto ? adicionarPontoAoTrajeto : null
              }
              onSelecionarPonto={
                editandoTrajeto ? null : selecionarPonto
              }
              onMoverPonto={
                editandoTrajeto ? null : alterarPontoNoMapa
              }
              onSelecionarLocal={
                !editandoTrajeto && pontoSelecionado ? selecionarLocal : null
              }
            />
          </div>

          <aside className={styles.painelEdicao}>
            <div className={styles.formLinha}>
              <label htmlFor="nomeLinha">Nome da linha</label>
              <div className={styles.linhaAcao}>
                <input
                  id="nomeLinha"
                  value={nomeLinha}
                  onChange={(event) => setNomeLinha(event.target.value)}
                />
                <button onClick={salvarLinha} title="Salvar linha">
                  <Save size= {18} />
                </button>
              </div>
            </div>

            <section className={styles.editorTrajeto}>
              <div className={styles.editorTrajetoTitulo}>
                <Route size={20} />
                <div>
                  <h3>Linha do trajeto</h3>
                  <p>
                    Desenhe o caminho do ônibus clicando sobre as ruas no mapa.
                  </p>
                </div>
              </div>

              {!editandoTrajeto ? (
                <button
                  className={styles.iniciarDesenho}
                  onClick={iniciarDesenhoTrajeto}
                  disabled={!rotaSelecionada?.id_rota}
                >
                  <Route size={17} />
                  DESENHAR TRAJETO
                </button>
              ) : (
                <>
                  <p className={styles.contadorTrajeto}>
                    {trajetoEmEdicao.length} pontos marcados
                  </p>

                  <div className={styles.acoesDesenho}>
                    <button
                      onClick={desfazerPontoDoTrajeto}
                      disabled={
                        trajetoEmEdicao.length === 0 || salvandoTrajeto
                      }
                    >
                      <Undo2 size={16} />
                      DESFAZER
                    </button>
                    <button
                      onClick={limparTrajeto}
                      disabled={
                        trajetoEmEdicao.length === 0 || salvandoTrajeto
                      }
                    >
                      <Eraser size={16} />
                      LIMPAR
                    </button>
                  </div>

                  <div className={styles.acoesSalvarTrajeto}>
                    <button
                      className={styles.cancelarTrajeto}
                      onClick={cancelarEdicaoTrajeto}
                      disabled={salvandoTrajeto}
                    >
                      CANCELAR
                    </button>
                    <button
                      className={styles.salvarTrajeto}
                      onClick={salvarTrajeto}
                      disabled={
                        trajetoEmEdicao.length < 2 || salvandoTrajeto
                      }
                    >
                      <Save size={16} />
                      {salvandoTrajeto ? "SALVANDO..." : "SALVAR TRAJETO"}
                    </button>
                  </div>
                </>
              )}
            </section>

            <h3>Pontos do trajeto</h3>
            <div className={styles.listaPontos}>
              {rotaSelecionada?.pontos.length ? (
                rotaSelecionada.pontos.map((ponto) => (
                  <button
                    key={ponto.id_ponto}
                    className={`${styles.itemPonto} ${
                      pontoSelecionado?.id_ponto === ponto.id_ponto
                        ? styles.itemAtivo
                        : ""
                    }`}
                    onClick={() => selecionarPonto(ponto)}
                  >
                    <MapPin size={17} />
                    {ponto.nome_ponto}
                  </button>
                ))
              ) : (
                <p>Nenhum ponto cadastrado nesta rota.</p>
              )}
            </div>

            {pontoSelecionado && (
              <div className={styles.formEdicao}>
                <label htmlFor="nomePonto">Ponto selecionado</label>
                <input
                  id="nomePonto"
                  value={nomePonto}
                  onChange={(event) => setNomePonto(event.target.value)}
                />

                <label>Latitude</label>
                <input value={latitude} readOnly />

                <label>Longitude</label>
                <input value={longitude} readOnly />

                <button className={styles.salvar} onClick={salvarPonto}>
                  SALVAR PONTO
                </button>
              </div>
            )}

            {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          </aside>
        </div>
      </main>

      {modalCadastroAberto && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModalCadastro();
            }
          }}
        >
          <form
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-cadastro-rota"
            onSubmit={cadastrarRota}
          >
            <button
              type="button"
              className={styles.fecharModal}
              onClick={fecharModalCadastro}
              aria-label="Fechar"
              disabled={cadastrandoRota}
            >
              <X size={20} />
            </button>

            <span className={styles.modalLegenda}>Nova rota</span>
            <h2 id="titulo-cadastro-rota">Cadastrar rota</h2>
            <p>
              Cada rota deve ter o nome de uma cor. Essa cor será usada para
              identificar o botão da rota quando ele estiver selecionado.
            </p>

            <fieldset className={styles.coresFieldset}>
              <legend>Escolha a cor da rota</legend>
              <div className={styles.opcoesCores}>
              {CORES_DE_ROTA.map((cor) => {
                const corJaCadastrada = rotas.some(
                  (rota) =>
                    rota.nome_linha?.trim().toUpperCase() === cor.nome
                );
                const selecionada = nomeNovaRota === cor.nome;

                return (
                  <button
                    type="button"
                    key={cor.nome}
                    className={`${styles.opcaoCor} ${
                      selecionada ? styles.opcaoCorSelecionada : ""
                    }`}
                    style={{ "--cor-opcao": cor.valor }}
                    onClick={() => setNomeNovaRota(cor.nome)}
                    aria-pressed={selecionada}
                    disabled={corJaCadastrada || cadastrandoRota}
                  >
                    <span className={styles.circuloCor} />
                    <span>{cor.nome}</span>
                    {corJaCadastrada && (
                      <small>Já cadastrada</small>
                    )}
                  </button>
                );
              })}
              </div>
            </fieldset>

            {nomeNovaRota && (
              <div className={styles.previaCor}>
                <span
                  className={styles.amostraCor}
                  style={{
                    backgroundColor: CORES_DE_ROTA.find(
                      (cor) => cor.nome === nomeNovaRota
                    )?.valor,
                  }}
                />
                O botão da rota usará esta cor.
              </div>
            )}

            <div className={styles.acoesModal}>
              <button
                type="button"
                className={styles.cancelarModal}
                onClick={fecharModalCadastro}
                disabled={cadastrandoRota}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className={styles.confirmarModal}
                disabled={cadastrandoRota}
              >
                <Plus size={18} />
                {cadastrandoRota ? "CADASTRANDO..." : "CADASTRAR"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
