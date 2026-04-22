import styles from './index.module.css';

export default function Negado() {
  return (
    <div className={styles.negadoContainer}>
      <div className={styles.overlay} />

      <div className={styles.negadoBox}>
        <div className={styles.icon}>🔒</div>

        <h1>Acesso negado</h1>

        <p>
          Você não possui permissão para acessar esta funcionalidade.
        </p>

        <button onClick={() => window.history.back()}>
          Voltar
        </button>
      </div>
    </div>
  );
}