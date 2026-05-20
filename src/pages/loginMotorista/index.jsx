import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from './index.module.css';

import { autenticarUsuario } from "../../services/auth";

export default function LoginMotora() {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  async function fazerLogin() {

    if (!usuario || !senha) {

      alert('Preencha usuário e senha.');

      return;

    }

    try {

      const usuarioEncontrado =
        await autenticarUsuario(
          usuario,
          senha,
          2
        );

      if (usuarioEncontrado) {

        navigate(
          `/teladomotorista/${usuarioEncontrado.id_motorista}`
        );

      } else {

        alert('Login inválido');

      }

    } catch (error) {

      console.error(
        'Erro ao fazer login:',
        error
      );

      alert('Erro ao fazer login.');

    }

  }

  return (

    <div className={styles.loginContainer}>

      <div className={styles.overlay} />

      <div className={styles.topBar}>

        <Link to="/">
          <button className={styles.homeBtn}>
            Home
          </button>
        </Link>

      </div>

      <div className={styles.loginBox}>

        <h1>Entrar</h1>

        <div className={styles.inputGroup}>

          <label>Nome de usuário</label>

          <input
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) =>
              setUsuario(e.target.value)
            }
          />

        </div>

        <div className={styles.inputGroup}>

          <label>Senha</label>

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
          />

        </div>

        <button
          className={styles.loginBtn}
          onClick={fazerLogin}
        >
          Entrar
        </button>

      </div>

    </div>

  );

}