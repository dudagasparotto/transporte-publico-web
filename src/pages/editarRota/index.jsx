import { useEffect, useState } from "react";
import { MapPin, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.css";
import api from "../../services/apis";
import { listarRotasComPontos } from "../../services/transporte";
import LeafletRouteMap from "../../components/LeafletRouteMap";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

export default function EditarRota() {
  const navigate = useNavigate();
  const { alert } = useAppDialog();
  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [nomeLinha, setNomeLinha] = useState("");
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [nomePonto, setNomePonto] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mensagem, setMensagem] = useState("");

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
    setMensagem("Arraste o marcador ou clique no mapa para mudar a posicao.");
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
    setMensagem("Posicao alterada. Clique em salvar ponto.");
  }

  function selecionarLocal(local) {
    if (pontoSelecionado) {
      alterarPontoNoMapa(pontoSelecionado, local);
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
        </div>

        <div className={styles.botoesRotas}>
          {rotas.map((rota) => (
            <button
              key={rota.id_linha}
              className={`${styles.botaoRota} ${
                rotaSelecionada?.id_linha === rota.id_linha ? styles.ativo : ""
              }`}
              style={{
                background:
                  rotaSelecionada?.id_linha === rota.id_linha
                    ? rota.cor
                    : "#6B7280",
              }}
              onClick={() => selecionarRota(rota)}
            >
              {rota.nome_linha}
            </button>
          ))}
        </div>

        <div className={styles.conteudoEdicao}>
          <div className={styles.areaMapa}>
            <LeafletRouteMap
              rotaNome={rotaSelecionada?.nome_mapa}
              pontos={rotaSelecionada?.pontos || []}
              corTrajeto={rotaSelecionada?.cor}
              mostrarTrajetoPontos
              onSelecionarPonto={selecionarPonto}
              onMoverPonto={alterarPontoNoMapa}
              onSelecionarLocal={pontoSelecionado ? selecionarLocal : null}
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
    </div>
  );
}
