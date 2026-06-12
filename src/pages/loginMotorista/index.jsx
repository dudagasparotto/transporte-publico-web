import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, UserRound } from "lucide-react";

import styles from "./index.module.css";

import {
  autenticarUsuario,
  criarSessao,
  encerrarSessao,
  TIPO_USUARIO_MOTORISTA,
} from "../../services/auth";
import api from "../../services/apis";
import { useAppDialog } from "../../components/AppDialog/useAppDialog";

export default function LoginMotora() {
  const navigate = useNavigate();
  const { alert } = useAppDialog();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin(event) {
    event.preventDefault();
    encerrarSessao();

    if (!usuario || !senha) {
      await alert("Preencha usuario e senha.");
      return;
    }

    try {
      const dadosAutenticacao = await autenticarUsuario(
        usuario,
        senha,
        TIPO_USUARIO_MOTORISTA
      );
      const usuarioEncontrado = dadosAutenticacao?.usuario;

      if (usuarioEncontrado) {
        const idMotoristaDoUsuario = Number(usuarioEncontrado.id_motorista);

        if (
          !Number.isInteger(idMotoristaDoUsuario) ||
          idMotoristaDoUsuario <= 0
        ) {
          await alert({
            title: "Acesso negado",
            message: "Este login nao pertence a um motorista.",
            variant: "danger",
          });
          return;
        }

        const { data } = await api.get("/motoristas");
        const motoristas = data.dados || [];
        const motoristaEncontrado = motoristas.find(
          (motorista) =>
            Number(motorista.id_motorista) === idMotoristaDoUsuario
        );

        if (!motoristaEncontrado) {
          await alert({
            title: "Acesso negado",
            message: "Este usuario nao possui um motorista vinculado.",
            variant: "danger",
          });
          return;
        }

        const idMotorista = motoristaEncontrado.id_motorista;

        criarSessao(dadosAutenticacao);
        navigate(`/teladomotorista/${idMotorista}`, { replace: true });
      } else {
        await alert({
          title: "Acesso negado",
          message: "Login invalido.",
          variant: "danger",
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      await alert("Erro ao fazer login.");
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
          <UserRound size={40} />
        </div>

        <h1>Login Motorista</h1>

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
