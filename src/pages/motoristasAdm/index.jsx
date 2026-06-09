import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Home, Star, Trash2, UserRoundPlus } from "lucide-react";

import api, { getArquivoUrl } from "../../services/apis";
import styles from "./styles.module.css";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

export default function MotoristasAdm() {
  const navigate = useNavigate();
  const { alert, confirm } = useAppDialog();

  const [motoristas, setMotoristas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindoId, setExcluindoId] = useState(null);
  const [fotosComErro, setFotosComErro] = useState({});

  const carregarMotoristas = useCallback(async function carregarMotoristas() {
    try {
      setCarregando(true);

      const { data } = await api.get("/motoristas");
      const lista = data.dados || [];

      const motoristasComAvaliacoes = lista.map((motorista) => {
        const avaliacoes = motorista.avaliacoes || motorista.avaliacao || [];
        const media =
          motorista.media ??
          motorista.media_avaliacao ??
          calcularMediaAvaliacoes(avaliacoes);

        return {
          ...motorista,
          avaliacoes,
          media,
        };
      });

      setMotoristas(motoristasComAvaliacoes);
    } catch (error) {
      console.error("Erro ao carregar motoristas:", error);
      await alert("Erro ao carregar motoristas cadastrados.");
    } finally {
      setCarregando(false);
    }
  }, [alert]);

  useEffect(() => {
    document.title = "Motoristas cadastrados";
    carregarMotoristas();
  }, [carregarMotoristas]);

  function calcularMediaAvaliacoes(avaliacoes) {
    if (!Array.isArray(avaliacoes) || avaliacoes.length === 0) return 0;

    const soma = avaliacoes.reduce(
      (total, avaliacao) => total + Number(avaliacao.nota_avaliacao || 0),
      0
    );

    return soma / avaliacoes.length;
  }

  async function excluirMotorista(id) {
    const confirmou = await confirm({
      title: "Excluir motorista",
      message: "Tem certeza que deseja excluir este motorista?",
      confirmLabel: "Excluir",
      variant: "danger",
    });

    if (!confirmou) return;

    try {
      setExcluindoId(id);

      const { data } = await api.delete(`/motoristas/${id}`);

      if (data.sucesso === false) {
        await alert(data.mensagem || "Erro ao excluir motorista.");
        return;
      }

      setMotoristas((listaAtual) =>
        listaAtual.filter((motorista) => motorista.id_motorista !== id)
      );

      await alert("Motorista excluido com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir motorista:", error);
      await alert("Erro ao excluir motorista.");
    } finally {
      setExcluindoId(null);
    }
  }

  function getIniciais(nome) {
    if (!nome) return "?";

    return nome
      .split(" ")
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join("");
  }

  function formatarMedia(media) {
    const numero = Number(media || 0);
    return numero > 0 ? numero.toFixed(1) : "0.0";
  }

  function renderEstrelas(nota) {
    const notaArredondada = Math.round(Number(nota || 0));

    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={
          index < notaArredondada ? styles.estrelaCheia : styles.estrelaVazia
        }
      >
        ★
      </span>
    ));
  }

  function fotoIndisponivel(id) {
    setFotosComErro((fotosAtuais) => ({
      ...fotosAtuais,
      [id]: true,
    }));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Motoristas cadastrados</h1>

        <nav className={styles.nav}>
          <Link to="/adm/cadmotora" className={styles.navButton}>
            <UserRoundPlus size={18} />
            Novo motorista
          </Link>

          <Link to="/adm" className={styles.navButton}>
            <Home size={18} />
            Voltar
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.container}>
          <div className={styles.topo}>
            <div>
              <span>Administracao</span>
              <h2>Lista de motoristas</h2>
            </div>

            <strong>{motoristas.length} cadastrados</strong>
          </div>

          {carregando ? (
            <p className={styles.mensagem}>Carregando motoristas...</p>
          ) : motoristas.length === 0 ? (
            <p className={styles.mensagem}>Nenhum motorista cadastrado.</p>
          ) : (
            <div className={styles.lista}>
              {motoristas.map((motorista) => (
                <article
                  key={motorista.id_motorista}
                  className={styles.cardMotorista}
                >
                  <div className={styles.perfil}>
                    {motorista.foto_motorista &&
                    !fotosComErro[motorista.id_motorista] ? (
                      <img
                        src={getArquivoUrl(motorista.foto_motorista)}
                        alt={motorista.nome_motorista}
                        className={styles.foto}
                        onError={() => fotoIndisponivel(motorista.id_motorista)}
                      />
                    ) : (
                      <div className={styles.avatar}>
                        {getIniciais(motorista.nome_motorista)}
                      </div>
                    )}

                    <div className={styles.dados}>
                      <h3>{motorista.nome_motorista}</h3>
                      <p>CPF: {motorista.cpf_motorista || "Nao informado"}</p>
                      <p>CNH: {motorista.cnh_motorista || "Nao informada"}</p>
                    </div>
                  </div>

                  <div className={styles.avaliacoesResumo}>
                    <div className={styles.media}>
                      <Star size={18} />
                      <strong>{formatarMedia(motorista.media)}</strong>
                      <span>{motorista.avaliacoes.length} avaliacoes</span>
                    </div>

                    <div className={styles.estrelas}>
                      {renderEstrelas(motorista.media)}
                    </div>
                  </div>

                  <div className={styles.avaliacoes}>
                    {motorista.avaliacoes.length > 0 ? (
                      motorista.avaliacoes.slice(0, 3).map((avaliacao) => (
                        <div
                          key={avaliacao.id_avaliacao}
                          className={styles.avaliacao}
                        >
                          <div className={styles.avaliacaoTopo}>
                            <span>{renderEstrelas(avaliacao.nota_avaliacao)}</span>
                            <strong>
                              {Number(avaliacao.nota_avaliacao || 0).toFixed(1)}
                            </strong>
                          </div>

                          <p>
                            {avaliacao.comentario_avaliacao ||
                              "Sem comentario."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className={styles.semAvaliacao}>
                        Nenhuma avaliacao recebida ainda.
                      </p>
                    )}
                  </div>

                  <div className={styles.acoes}>
                    <button
                      type="button"
                      className={styles.editar}
                      onClick={() =>
                        navigate(`/adm/motoristas/${motorista.id_motorista}/editar`)
                      }
                    >
                      <Edit size={17} />
                      Editar
                    </button>

                    <button
                      type="button"
                      className={styles.excluir}
                      disabled={excluindoId === motorista.id_motorista}
                      onClick={() => excluirMotorista(motorista.id_motorista)}
                    >
                      <Trash2 size={17} />
                      {excluindoId === motorista.id_motorista
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
