import { useEffect, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import api from "../../services/apis";
import { listarRotasComPontos } from "../../services/transporte";
import LeafletRouteMap from "../../components/LeafletRouteMap";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

export default function CadastroPontos() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alert } = useAppDialog();
  const rotaInicial = location.state?.id_rota || "";

  const [nomePonto, setNomePonto] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [rotas, setRotas] = useState([]);
  const [idRota, setIdRota] = useState(rotaInicial);

  function primeiraRotaValida(listaRotas) {
    return listaRotas.find((rota) => Number.isFinite(Number(rota.id_rota)));
  }

  useEffect(() => {
    document.title = "Cadastro de Pontos";

    async function iniciarCadastro() {
      try {
        const dados = await listarRotasComPontos();
        setRotas(dados);
        setIdRota((rotaAtual) =>
          rotaAtual || primeiraRotaValida(dados)?.id_rota || ""
        );
      } catch (error) {
        console.error("Erro ao carregar rotas:", error);
      }
    }

    iniciarCadastro();
  }, []);

  async function carregarRotas() {
    try {
      const dados = await listarRotasComPontos();
      setRotas(dados);
      setIdRota((rotaAtual) =>
        rotaAtual || primeiraRotaValida(dados)?.id_rota || ""
      );
    } catch (error) {
      console.error("Erro ao carregar rotas:", error);
    }
  }

  function selecionarLocal(local) {
    setLatitude(local.latitude.toFixed(8));
    setLongitude(local.longitude.toFixed(8));
  }

  async function salvar() {
    const idRotaNumerico = Number(idRota);

    if (
      !nomePonto.trim() ||
      !latitude ||
      !longitude ||
      !Number.isFinite(idRotaNumerico) ||
      idRotaNumerico <= 0
    ) {
      await alert("Informe o nome, a rota e marque o ponto no mapa.");
      return;
    }

    try {
      const { data } = await api.post("/pontos", {
        nome_pontos: nomePonto.trim(),
        nome_dos_pontos: nomePonto.trim(),
        latitude_pontos: Number(latitude),
        latitude_dos_pontos: Number(latitude),
        longitude_pontos: Number(longitude),
        longitude_dos_pontos: Number(longitude),
        id_rota: idRotaNumerico,
      });

      if (!data.sucesso) {
        await alert(data.mensagem || "Erro ao cadastrar ponto.");
        return;
      }

      setNomePonto("");
      setLatitude("");
      setLongitude("");
      await carregarRotas();

      await alert("Ponto cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar ponto:", error);
      await alert(error.response?.data?.mensagem || "Erro ao cadastrar ponto.");
    }
  }

  const rotaSelecionada = rotas.find(
    (rota) => String(rota.id_rota) === String(idRota)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Cadastro de Pontos</h1>

        <button
          className={styles.botaoVoltar}
          onClick={() => navigate("/adm/editarpontos")}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </header>

      <main className={styles.layout}>
        <section className={styles.card}>
          <h2>Novo ponto</h2>

          <div className={styles.formGroup}>
            <label htmlFor="rota">Rota</label>
            <select
              id="rota"
              value={idRota}
              onChange={(e) => setIdRota(e.target.value)}
            >
              {rotas
                .filter((rota) => Number.isFinite(Number(rota.id_rota)))
                .map((rota) => (
                <option key={rota.id_rota} value={rota.id_rota}>
                  {rota.nome_linha}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomePonto">Nome do ponto</label>
            <input
              id="nomePonto"
              type="text"
              placeholder="Ex.: Terminal Central"
              value={nomePonto}
              onChange={(e) => setNomePonto(e.target.value)}
            />
          </div>

          <div className={styles.localSelecionado}>
            <MapPin size={22} />

            {latitude ? (
              <div>
                <strong>Local selecionado</strong>
                <span>{latitude}, {longitude}</span>
              </div>
            ) : (
              <strong>Selecione um local no mapa</strong>
            )}
          </div>

          <button
            type="button"
            className={styles.btn}
            onClick={salvar}
          >
            Cadastrar ponto
          </button>
        </section>

        <section className={styles.mapCard}>
          <div className={styles.mapHeader}>
            <h2>Marcar ponto</h2>
            <span>{rotaSelecionada?.nome_linha || "Rota"}</span>
          </div>

          <div className={styles.mapa}>
            <LeafletRouteMap
              rotaNome={rotaSelecionada?.nome_mapa}
              pontos={rotaSelecionada?.pontos || []}
              trajeto={rotaSelecionada?.trajeto || []}
              corTrajeto={rotaSelecionada?.cor}
              pontoMarcado={
                latitude
                  ? {
                      latitude,
                      longitude,
                      nome: nomePonto || "Novo ponto",
                    }
                  : null
              }
              onSelecionarLocal={selecionarLocal}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
