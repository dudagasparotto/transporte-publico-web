import { Link } from "react-router";
import styles from './index.module.css';

export default function LoginAdm() {
  return (
    <div className={styles.loginContainer}>
      
      <div className={styles.overlay} />

      <div className={styles.topBar}>
        <Link to="/">
          <button className={styles.homeBtn}>Home</button>
        </Link>
      </div>

      <div className={styles.loginBox}>
        <h1>Entrar</h1>

        <div className={styles.inputGroup}>
          <label>Nome de usuário</label>
          <input type="text" placeholder="Digite seu usuário" />
        </div>

        <div className={styles.inputGroup}>
          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />
        </div>

        <Link to="/adm">
          <button className={styles.loginBtn}>Entrar</button>
        </Link>
      </div>
    </div>
  );
}