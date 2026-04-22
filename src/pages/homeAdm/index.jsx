import { Link } from "react-router";
import styles from './index.module.css';

import pontos from "../../assets/pontos.png";
import rotas from "../../assets/rotas.png";
import horarios from "../../assets/horarios.png";

export default function HomeAdm() {
  return (
    <div className={styles.adminContainer}>
      
      <header className={styles.adminHeader}>
        <h1 className={styles.h1}>TRANSPORTE PÚBLICO</h1>

        <nav>
          <Link to='/'>
            <button className={styles.botao}>Home</button>
          </Link>
        </nav>
      </header>

      <div className={styles.overlay} />

      <main className={styles.adminContent}>
        
        <div className={styles.adminCard}>
          <img src={pontos} />
          <h3>Pontos de Ônibus</h3>
          <Link to='/adm/editarpontos'>
            <button>Editar</button>
          </Link>
        </div>

        <div className={styles.adminCard}>
          <img src={horarios} />
          <h3>Horários</h3> 
          <Link to='/adm/editarhorarios'>
            <button>Editar</button>
          </Link>
        </div>

        <div className={styles.adminCard}>
          <img src={rotas} />
          <h3>Rotas</h3>
          <Link to='/adm/editarrota'>
            <button>Editar</button>
          </Link>
        </div>

        <div className={styles.adminCard}>
          <div className={styles.icon}>👮</div>
          <h3>Motoristas</h3>
          <Link to='/adm/cadmotora'>
            <button>Editar</button>
          </Link>
        </div>

      </main>
    </div>
  );
}