import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import styles from "./index.module.css";

export default function Negado() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirecionarPara =
    location.state?.redirecionarPara || "/loginadm";

  return (
    <div className={styles.negadoContainer}>
      <div className={styles.overlay} />

      <div className={styles.negadoBox}>
        <div className={styles.icon}>
          <LockKeyhole size={48} />
        </div>

        <h1>Acesso negado</h1>

        <p>Você não possui permissão para acessar esta funcionalidade.</p>

        <button onClick={() => navigate(redirecionarPara, { replace: true })}>
          <ArrowLeft size={18} />
          Ir para o login
        </button>
      </div>
    </div>
  );
}
