import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, ShieldCheck } from "lucide-react";
import styles from "./index.module.css";
import {
  autenticarUsuario,
  criarSessao,
  TIPO_USUARIO_ADMIN,
} from "../../services/auth";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

export default function LoginAdm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { alert } = useAppDialog();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin(event) {
    event.preventDefault();

    if (!usuario || !senha) {
      await alert("Preencha usuario e senha.");
      return;
    }

    try {
      const dadosAutenticacao = await autenticarUsuario(
        usuario,
        senha,
        TIPO_USUARIO_ADMIN
      );

      criarSessao(dadosAutenticacao);

      const destino = location.state?.from?.pathname;
      navigate(destino?.startsWith("/adm") ? destino : "/adm", {
        replace: true,
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      await alert({
        title: "Acesso negado",
        message:
          error.response?.data?.mensagem ||
          "Usuario ou senha invalidos.",
        variant: "danger",
      });
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.overlay} />

      <div className={styles.topBar}>
        <Link to="/">
          <button className={styles.homeBtn}>
            <Home size={18} />
            Home
          </button>
        </Link>
      </div>

      <form className={styles.loginBox} onSubmit={fazerLogin}>
        <div className={styles.loginIcon}>
          <ShieldCheck size={40} />
        </div>

        <h1>Login Administrador</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="usuario">Nome de usuario</label>
          <input
            id="usuario"
            type="text"
            placeholder="Digite seu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button className={styles.loginBtn} type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}
