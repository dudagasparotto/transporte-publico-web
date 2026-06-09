import { useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import styles from "./index.module.css";

export default function Negado() {
  const navigate = useNavigate();

  return (
    <div className={styles.negadoContainer}>
      <div className={styles.overlay} />

      <div className={styles.negadoBox}>
        <div className={styles.icon}>
          <LockKeyhole size={48} />
        </div>

        <h1>Acesso negado</h1>

        <p>Voce nao possui permissao para acessar esta funcionalidade.</p>

        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>
    </div>
  );
}
