import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.css";
import api from "../../services/apis";
import { listarRotasComPontos } from "../../services/transporte";
import LeafletRouteMap from "../../components/LeafletRouteMap";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

export default function EditarPontos() {
  const navigate = useNavigate();
  const { alert } = useAppDialog();
  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    async function iniciarEdicao() {
      try {
        const dados = await listarRotasComPontos();
        setRotas(dados);
        setRotaSelecionada(dados[0] || null);
      } catch (error) {
        console.error("Erro ao carregar pontos:", error);
      }
    }

    iniciarEdicao();
  }, []);

  async function carregarRotas(idRota, idPonto) {
    try {
      const dados = await listarRotasComPontos();
      setRotas(dados);

      const rotaAtual =
        dados.find((rota) => rota.id_rota === idRota) || dados[0] || null;

      setRotaSelecionada(rotaAtual);

      if (rotaAtual && idPonto) {
        const pontoAtual = rotaAtual.pontos.find(
          (ponto) => ponto.id_ponto === idPonto
        );

        if (pontoAtual) {
          setPontoSelecionado(pontoAtual);
          setNome(pontoAtual.nome_ponto);
          setLatitude(String(pontoAtual.latitude));
          setLongitude(String(pontoAtual.longitude));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar pontos:", error);
    }
  }

  function selecionarRota(rota) {
    setRotaSelecionada(rota);
    setPontoSelecionado(null);
    setNome("");
    setLatitude("");
    setLongitude("");
  }

  function selecionarPonto(ponto) {
    setPontoSelecionado(ponto);
    setNome(ponto.nome_ponto);
    setLatitude(String(ponto.latitude));
    setLongitude(String(ponto.longitude));
  }

  function alterarLocal(local) {
    const latitudeNova = local.latitude.toFixed(8);
    const longitudeNova = local.longitude.toFixed(8);
    const pontoAtualizado = {
      ...pontoSelecionado,
      latitude: latitudeNova,
      longitude: longitudeNova,
      localizacao: `${latitudeNova}, ${longitudeNova}`,
    };

    setLatitude(latitudeNova);
    setLongitude(longitudeNova);
    setPontoSelecionado(pontoAtualizado);
    setRotaSelecionada({
      ...rotaSelecionada,
      pontos: rotaSelecionada.pontos.map((ponto) =>
        ponto.id_ponto === pontoAtualizado.id_ponto ? pontoAtualizado : ponto
      ),
    });
  }

  async function salvarPonto() {
    if (!pontoSelecionado || !nome || !latitude || !longitude) {
      await alert("Selecione um ponto para editar.");
      return;
    }

    try {
      const { data } = await api.patch(`/pontos/${pontoSelecionado.id_ponto}`, {
        nome_pontos: nome,
        nome_dos_pontos: nome,
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

      await carregarRotas(rotaSelecionada.id_rota, pontoSelecionado.id_ponto);
      await alert("Ponto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar ponto:", error);
      await alert(error.response?.data?.mensagem || "Erro ao atualizar ponto.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <header className={styles.header}>
        <h1 className={styles.titulo}>
          PAINEL ADMINISTRATIVO - EDITAR PONTOS
        </h1>

        <button
          className={styles.botaoVoltar}
          onClick={() => navigate("/adm")}
        >
          VOLTAR
        </button>
      </header>

      <main className={styles.card}>
        <div className={styles.topo}>
          <div>
            <h2 className={styles.subtitulo}>
              Pontos das rotas
            </h2>

            <p className={styles.descricao}>
              Selecione uma rota e escolha o ponto no mapa ou na lista.
            </p>
          </div>

          <button
            className={styles.botaoCadPontos}
            onClick={() =>
              navigate("/cadpontos", {
                state: {
                  id_rota: rotaSelecionada?.id_rota,
                },
              })
            }
          >
            <Plus size={18} />
            CADASTRAR PONTO
          </button>
        </div>

        <div className={styles.botoesRotas}>
          {rotas.map((rota) => (
            <button
              key={rota.id_rota}
              className={`${styles.botaoRota} ${
                rotaSelecionada?.id_rota === rota.id_rota
                  ? styles.ativo
                  : ""
              }`}
              style={{
                background:
                  rotaSelecionada?.id_rota === rota.id_rota
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
              onSelecionarPonto={selecionarPonto}
              onSelecionarLocal={pontoSelecionado ? alterarLocal : null}
              className={styles.iframe}
            />
          </div>

          <aside className={styles.painelEdicao}>
            <h3>Pontos cadastrados</h3>

            <div className={styles.listaPontos}>
              {rotaSelecionada?.pontos.length > 0 ? (
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
                <label>Nome do ponto</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />

                <label>Latitude</label>
                <input value={latitude} readOnly />

                <label>Longitude</label>
                <input value={longitude} readOnly />

                <button
                  className={styles.salvar}
                  onClick={salvarPonto}
                >
                  SALVAR ALTERACOES
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
