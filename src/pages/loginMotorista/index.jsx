import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, UserRound } from "lucide-react";

import styles from "./index.module.css";

import { autenticarUsuario } from "../../services/auth";
import api from "../../services/apis";

export default function LoginMotora() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin(event) {
    event.preventDefault();

    if (!usuario || !senha) {
      alert("Preencha usuario e senha.");
      return;
    }

    try {
      const usuarioEncontrado = await autenticarUsuario(usuario, senha, 2);

      if (usuarioEncontrado) {
        const { data } = await api.get("/motoristas");
        const motoristas = data.dados || [];
        const motoristaEncontrado = motoristas.find((motorista) => {
          const mesmoId = motorista.id_motorista === usuarioEncontrado.id_usuario;
          const mesmoNome =
            String(motorista.nome_motorista).toLowerCase() ===
            String(usuarioEncontrado.nome_usuario).toLowerCase();

          return mesmoId || mesmoNome;
        });

        navigate(
          `/teladomotorista/${
            motoristaEncontrado?.id_motorista || usuarioEncontrado.id_usuario
          }`
        );
      } else {
        alert("Login invalido.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login.");
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
