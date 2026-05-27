import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from './index.module.css';

import { autenticarUsuario } from "../../services/auth";
import api from "../../services/apis";

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
        console.log('Usuário autenticado:', usuarioEncontrado);

        const { data } = await api.get('/motoristas');
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
        )
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
