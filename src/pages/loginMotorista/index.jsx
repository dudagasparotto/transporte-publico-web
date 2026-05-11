import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from './index.module.css';

export default function LoginMotora() {

  const navigate = useNavigate();

  const [usuario, setUsuario] =
    useState('');

  const [senha, setSenha] =
    useState('');

  async function fazerLogin() {

    if (!usuario || !senha) {

      alert(
        'Preencha usuário e senha.'
      );

      return;

    }

    try {

      // AQUI VAI SUA API

      // exemplo:

      /*
      const response = await fetch(
        'http://localhost:3000/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            usuario,
            senha,
          }),
        }
      );

      const data =
        await response.json();

      if (data.sucesso) {

        navigate('/adm');

      } else {

        alert('Login inválido');

      }
      */

      navigate('/adm');

    } catch (error) {

      console.error(
        'Erro ao fazer login:',
        error
      );

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

          <label>
            Nome de usuário
          </label>

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