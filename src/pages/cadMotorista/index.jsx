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
  const [carregandoMotorista, setCarregandoMotorista] = useState(editando);
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
          await alert(data.mensagem || "Motorista nao encontrado.");
          navigate("/adm/motoristas");
          return;
        }

        const motoristas = data.dados || [];
        const motorista = motoristas.find(
          (item) => Number(item.id_motorista) === Number(id)
        );

        if (!motorista) {
          await alert("Motorista nao encontrado.");
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
            setSenha(usuarioMotorista.senha_usuario || "");
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

  function handleFoto(e) {

    const file = e.target.files[0];

    if (file) {
      setFoto(file);
    }

  }

  async function salvar(event) {
    event.preventDefault();

    const cpfNumerico = somenteNumeros(cpf);
    const cnhNumerica = somenteNumeros(cnh);
    const nomeLimpo = nome.trim();
    const loginLimpo = login.trim();
    const senhaLimpa = senha.trim();

    if (!cpfNumerico || !cnhNumerica || !nomeLimpo || !loginLimpo || !senhaLimpa) {

      await alert(
        editando
          ? "Preencha todos os campos para editar o motorista."
          : "Preencha todos os campos para cadastrar o motorista."
      );

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
      }

      const { data } = editando
        ? await api.put(`/motoristas/${id}`, formData)
        : await api.post("/motoristas", formData);

      if (data.sucesso === false) {
        await alert(data.mensagem || "Erro ao salvar motorista.");
        return;
      }

      if (editando) {
        await atualizarLoginMotoristaSePossivel(idMotorista, loginLimpo, senhaLimpa);
      } else {
        await criarLoginMotorista(idMotorista, loginLimpo, senhaLimpa);
      }

      if (!editando) {
        setCpf("");
        setCnh("");
        setNome("");
        setLogin("");
        setSenha("");
        setFoto(null);
        setFotoAtual("");
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

      await alert(error.message || "Erro ao salvar motorista.");

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
      senha_usuario: senhaMotorista,
    };

    try {
      const { data } = await api.post("/usuarios", dadosLogin);

      if (data.sucesso === false) {
        throw new Error(data.mensagem || "Nao foi possivel criar o login.");
      }
    } catch (error) {
      console.error("Erro ao salvar login do motorista:", error);

      throw new Error(
        `Motorista cadastrado, mas nao foi possivel criar o login. Erro da API: ${obterMensagemErro(
          error,
          "erro desconhecido"
        )}`
      );
    }
  }

  async function atualizarLoginMotoristaSePossivel(idMotorista, loginMotorista, senhaMotorista) {
    const dadosLogin = {
      id_tipo_usuario: TIPO_USUARIO_MOTORISTA,
      id_motorista: idMotorista,
      nome_usuario: loginMotorista,
      senha_usuario: senhaMotorista,
    };

    try {
      const { data } = await api.get("/usuarios");
      const usuarios = data.dados || [];
      const usuarioMotorista = usuarios.find((usuario) => {
        const mesmoMotorista = Number(usuario.id_motorista) === Number(idMotorista);
        const mesmoId = Number(usuario.id_usuario) === Number(idMotorista);
        const mesmoNome =
          String(usuario.nome_usuario).toLowerCase() ===
          String(loginMotorista).toLowerCase();

        return (
          Number(usuario.id_tipo_usuario) === TIPO_USUARIO_MOTORISTA &&
          (mesmoMotorista || mesmoId || mesmoNome)
        );
      });

      if (!usuarioMotorista) return;

      await api.put(`/usuarios/${usuarioMotorista.id_usuario}`, dadosLogin);
    } catch (error) {
      console.error("Erro ao atualizar login do motorista:", error);
      await alert(
        "Motorista salvo, mas nao foi possivel atualizar o login porque a API de usuarios nao aceitou a alteracao."
      );
    }
  }

  if (carregandoMotorista) {
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
            <p className={styles.loadingText}>Carregando dados do motorista...</p>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className={styles.page}>

      <div className={styles.container}>

        <header className={styles.header}>

          <h1>{editando ? "EDITAR MOTORISTA" : "CADASTRO DE MOTORISTAS"}</h1>

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

                    <span>Selecionar Foto</span>

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

              <div className={styles.loginSection}>
                <h3>Acesso do Motorista</h3>

                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label>Login</label>

                    <input
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder="Usuario para acessar o site"
                    />
                  </div>

                  <div className={styles["form-group"]}>
                    <label>Senha</label>

                    <input
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Senha do motorista"
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
                    ? "Salvar Alteracoes"
                    : "Cadastrar Motorista"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

}
