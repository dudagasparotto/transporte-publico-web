import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.css";
import api, { getArquivoUrl } from "../../services/apis";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

const TIPO_USUARIO_MOTORISTA = 2;

export default function Motorista() {
  const navigate = useNavigate();
  const { alert } = useAppDialog();
  const { id } = useParams();
  const editando = Boolean(id);

  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoAtual, setFotoAtual] = useState("");
  const [rotas, setRotas] = useState([]);
  const [idsRotasSelecionadas, setIdsRotasSelecionadas] = useState([]);
  const [carregandoMotorista, setCarregandoMotorista] = useState(editando);
  const [carregandoRotas, setCarregandoRotas] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    document.title = editando ? "Editar Motorista" : "Cadastro de Motorista";
  }, [editando]);

  useEffect(() => {
    async function carregarMotorista() {
      if (!editando) return;

      try {
        setCarregandoMotorista(true);

        const { data } = await api.get("/motoristas");

        if (data.sucesso === false) {
          await alert(data.mensagem || "Motorista não encontrado.");
          navigate("/adm/motoristas");
          return;
        }

        const motoristas = data.dados || [];
        const motorista = motoristas.find(
          (item) => Number(item.id_motorista) === Number(id)
        );

        if (!motorista) {
          await alert("Motorista não encontrado.");
          navigate("/adm/motoristas");
          return;
        }

        setCpf(motorista.cpf_motorista || "");
        setCnh(motorista.cnh_motorista || "");
        setNome(motorista.nome_motorista || "");
        setFotoAtual(motorista.foto_motorista || "");

        try {
          const usuariosResp = await api.get("/usuarios");
          const usuarios = usuariosResp.data.dados || [];
          const usuarioMotorista = usuarios.find((usuario) => {
            const mesmoMotorista = Number(usuario.id_motorista) === Number(id);
            const mesmoId = Number(usuario.id_usuario) === Number(id);
            const mesmoNome =
              String(usuario.nome_usuario).toLowerCase() ===
              String(motorista.nome_motorista || "").toLowerCase();

            return (
              Number(usuario.id_tipo_usuario) === TIPO_USUARIO_MOTORISTA &&
              (mesmoMotorista || mesmoId || mesmoNome)
            );
          });

          if (usuarioMotorista) {
            setLogin(usuarioMotorista.nome_usuario || "");
            setSenha("");
          }
        } catch (error) {
          console.error("Erro ao carregar login do motorista:", error);
        }
      } catch (error) {
        console.error("Erro ao carregar motorista:", error);
        await alert("Erro ao carregar motorista.");
        navigate("/adm/motoristas");
      } finally {
        setCarregandoMotorista(false);
      }
    }

    carregarMotorista();
  }, [editando, id, navigate, alert]);

  useEffect(() => {
    async function carregarRotas() {
      try {
        setCarregandoRotas(true);

        const rotasResp = await api.get("/rotas");
        setRotas(rotasResp.data.dados || []);

        if (editando) {
          const rotasMotoristaResp = await api.get(`/motoristas/${id}/rotas`);
          const rotasDoMotorista =
            rotasMotoristaResp.data.dados?.rotas || [];

          setIdsRotasSelecionadas(
            rotasDoMotorista.map((rota) => Number(rota.id_rota))
          );
        }
      } catch (error) {
        console.error("Erro ao carregar rotas do motorista:", error);
        await alert("Não foi possível carregar as rotas disponíveis.");
      } finally {
        setCarregandoRotas(false);
      }
    }

    carregarRotas();
  }, [editando, id, alert]);

  function handleFoto(e) {

    const file = e.target.files[0];

    if (file) {
      setFoto(file);
    }

  }

  function alternarRota(idRota) {
    const idNumerico = Number(idRota);

    setIdsRotasSelecionadas((idsAtuais) =>
      idsAtuais.includes(idNumerico)
        ? idsAtuais.filter((idAtual) => idAtual !== idNumerico)
        : [...idsAtuais, idNumerico]
    );
  }

  async function salvar(event) {
    event.preventDefault();

    const cpfNumerico = somenteNumeros(cpf);
    const cnhNumerica = somenteNumeros(cnh);
    const nomeLimpo = nome.trim();
    const loginLimpo = login.trim();
    const senhaLimpa = senha.trim();

    if (
      !cpfNumerico ||
      !cnhNumerica ||
      !nomeLimpo ||
      !loginLimpo ||
      (!editando && !senhaLimpa)
    ) {

      await alert(
        editando
          ? "Preencha todos os campos para editar o motorista."
          : "Preencha todos os campos para cadastrar o motorista."
      );

      return;

    }

    if (idsRotasSelecionadas.length === 0) {
      await alert("Selecione pelo menos uma rota para o motorista.");
      return;
    }

    try {
      setSalvando(true);
      const idMotorista = editando ? Number(id) : await buscarProximoIdMotorista();

      const formData = new FormData();

      if (idMotorista) {
        formData.append("id_motorista", idMotorista);
      }

      formData.append("cpf_motorista", cpfNumerico);
      formData.append("cnh_motorista", cnhNumerica);
      formData.append("nome_motorista", nomeLimpo);

      if (foto) {
        formData.append("foto", foto);
      } else if (fotoAtual) {
        formData.append("foto_motorista", fotoAtual);
      }

      const { data } = editando
        ? await api.patch(`/motoristas/${id}`, formData)
        : await api.post("/motoristas", formData);

      if (data.sucesso === false) {
        await alert(data.mensagem || "Erro ao salvar motorista.");
        return;
      }

      const idMotoristaSalvo = Number(
        data.dados?.id_motorista ?? data.dados?.id ?? idMotorista
      );

      if (!Number.isInteger(idMotoristaSalvo) || idMotoristaSalvo <= 0) {
        throw new Error("A API não retornou o ID do motorista salvo.");
      }

      await salvarRotasMotorista(idMotoristaSalvo);

      if (editando) {
        await atualizarLoginMotoristaSePossivel(
          idMotoristaSalvo,
          loginLimpo,
          senhaLimpa
        );
      } else {
        await criarLoginMotorista(idMotoristaSalvo, loginLimpo, senhaLimpa);
      }

      if (!editando) {
        setCpf("");
        setCnh("");
        setNome("");
        setLogin("");
        setSenha("");
        setFoto(null);
        setFotoAtual("");
        setIdsRotasSelecionadas([]);
      }

      await alert(
        editando
          ? "Motorista atualizado com sucesso!"
          : "Motorista cadastrado com sucesso!"
      );

      navigate("/adm/motoristas");

    } catch (error) {

      console.error(
        "Erro ao cadastrar motorista:",
        error
      );

      await alert(obterMensagemErro(error, "Erro ao salvar motorista."));

    } finally {
      setSalvando(false);
    }

  }

  function somenteNumeros(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function obterMensagemErro(error, mensagemPadrao) {
    return (
      error.response?.data?.dados ||
      error.response?.data?.mensagem ||
      error.message ||
      mensagemPadrao
    );
  }

  async function buscarProximoIdMotorista() {
    const { data } = await api.get("/motoristas");
    const motoristas = data.dados || [];
    const maiorId = motoristas.reduce((maior, motorista) => {
      const idAtual = Number(motorista.id_motorista || 0);
      return idAtual > maior ? idAtual : maior;
    }, 0);

    return maiorId + 1;
  }

  async function criarLoginMotorista(idMotorista, loginMotorista, senhaMotorista) {
    const dadosLogin = {
      id_tipo_usuario: TIPO_USUARIO_MOTORISTA,
      id_motorista: idMotorista,
      nome_usuario: loginMotorista,
    };

    if (senhaMotorista) {
      dadosLogin.senha_usuario = senhaMotorista;
    }

    try {
      const { data } = await api.post("/usuarios", dadosLogin);

      if (data.sucesso === false) {
        throw new Error(data.mensagem || "Não foi possível criar o login.");
      }
    } catch (error) {
      console.error("Erro ao salvar login do motorista:", error);

      throw new Error(
        `Motorista cadastrado, mas não foi possível criar o login. Erro da API: ${obterMensagemErro(
          error,
          "erro desconhecido"
        )}`
      );
    }
  }

  async function salvarRotasMotorista(idMotorista) {
    const { data } = await api.put(`/motoristas/${idMotorista}/rotas`, {
      ids_rotas: idsRotasSelecionadas,
    });

    if (data.sucesso === false) {
      throw new Error(data.mensagem || "Não foi possível salvar as rotas.");
    }
  }

  async function atualizarLoginMotoristaSePossivel(idMotorista, loginMotorista, senhaMotorista) {
    const dadosLogin = {
      id_tipo_usuario: TIPO_USUARIO_MOTORISTA,
      id_motorista: idMotorista,
      nome_usuario: loginMotorista,
    };

    if (senhaMotorista) {
      dadosLogin.senha_usuario = senhaMotorista;
    }

    try {
      const { data } = await api.get("/usuarios");
      const usuarios = data.dados || [];
      const usuarioMotorista = usuarios.find(
        (usuario) =>
          Number(usuario.id_tipo_usuario) === TIPO_USUARIO_MOTORISTA &&
          Number(usuario.id_motorista) === Number(idMotorista)
      );

      if (!usuarioMotorista) {
        await criarLoginMotorista(idMotorista, loginMotorista, senhaMotorista);
        return;
      }

      await api.patch(`/usuarios/${usuarioMotorista.id_usuario}`, dadosLogin);
    } catch (error) {
      console.error("Erro ao atualizar login do motorista:", error);
      await alert(
        "Motorista salvo, mas não foi possível atualizar o login porque a API de usuários não aceitou a alteração."
      );
    }
  }

  if (carregandoMotorista || carregandoRotas) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>EDITAR MOTORISTA</h1>

            <div className={styles.headerActions}>
              <Link to="/adm/motoristas" className={styles["home-btn"]}>
                VOLTAR
              </Link>
            </div>
          </header>

          <div className={styles.card}>
            <p className={styles.loadingText}>
              Carregando dados e rotas do motorista...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className={styles.page}>

      <div className={styles.container}>

        <header className={styles.header}>

          <h1>{editando ? "EDITAR MOTORISTA" : "CADASTRO DE MOTORISTA"}</h1>

          <div className={styles.headerActions}>
            <Link to="/adm/motoristas" className={styles["home-btn"]}>
              VER MOTORISTAS
            </Link>

            <Link to="/adm" className={styles["home-btn"]}>
              VOLTAR
            </Link>
          </div>

        </header>

        <div className={styles.card}>

          <h2>{editando ? "Dados do Motorista" : "Novo Motorista"}</h2>

          <div className={styles.content}>

            <form className={styles.form} onSubmit={salvar}>

              <div className={styles["form-row"]}>

                <div className={styles["form-group"]}>

                  <label>CPF</label>

                  <input
                    value={cpf}
                    onChange={(e) =>
                      setCpf(e.target.value)
                    }
                    placeholder="000.000.000-00"
                  />

                </div>

                <div className={styles["form-group"]}>

                  <label>CNH</label>

                  <input
                    value={cnh}
                    onChange={(e) =>
                      setCnh(e.target.value)
                    }
                    placeholder="Número da CNH"
                  />

                </div>

              </div>

              <div className={styles["foto-section"]}>

                <label>Foto</label>

                <div className={styles["foto-box"]}>

                  {foto ? (

                    <img
                      src={URL.createObjectURL(foto)}
                      alt="preview"
                    />

                  ) : fotoAtual ? (

                    <img
                      src={getArquivoUrl(fotoAtual)}
                      alt={nome || "Motorista"}
                    />

                  ) : (

                    <span>Selecionar foto</span>

                  )}

                  <input
                    type="file"
                    onChange={handleFoto}
                  />

                </div>

              </div>

              <div className={styles["form-group"]}>

                <label>Nome Completo</label>

                <input
                  value={nome}
                  onChange={(e) =>
                    setNome(e.target.value)
                  }
                  placeholder="Nome do motorista"
                />

              </div>

              <div className={styles.rotasSection}>
                <div className={styles.rotasHeader}>
                  <div>
                    <h3>Rotas do Motorista</h3>
                    <p>Selecione uma ou mais linhas que ele vai realizar.</p>
                  </div>

                  <strong>
                    {idsRotasSelecionadas.length} selecionada
                    {idsRotasSelecionadas.length === 1 ? "" : "s"}
                  </strong>
                </div>

                <div
                  className={styles.rotasGrid}
                  role="group"
                  aria-label="Rotas do motorista"
                >
                  {rotas.map((rota) => {
                    const selecionada = idsRotasSelecionadas.includes(
                      Number(rota.id_rota)
                    );

                    return (
                      <button
                        key={rota.id_rota}
                        type="button"
                        className={`${styles.rotaOption} ${
                          selecionada ? styles.rotaOptionAtiva : ""
                        }`}
                        aria-pressed={selecionada}
                        onClick={() => alternarRota(rota.id_rota)}
                      >
                        <span>{rota.nome_linhas || `Rota ${rota.id_rota}`}</span>
                        <small>
                          {selecionada ? "Selecionada" : "Selecionar"}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.loginSection}>
                <h3>Acesso do Motorista</h3>

                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label>Login</label>

                    <input
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder="Usuário para acessar o site"
                    />
                  </div>

                  <div className={styles["form-group"]}>
                    <label>
                      {editando ? "Nova senha (opcional)" : "Senha"}
                    </label>

                    <input
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder={
                        editando
                          ? "Deixe em branco para manter a senha atual"
                          : "Senha do motorista"
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={styles.btn}
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : editando
                    ? "Salvar Alterações"
                    : "Cadastrar Motorista"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

}
