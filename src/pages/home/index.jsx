import { Link } from "react-router";

import styles from './index.module.css';
import verhorario from '../../assets/horarios.png';
import verrotas from '../../assets/rotas.png';

export default function Home() {
    return (
        <div className={styles.container}>
      <header className={styles.header}>
        <h1>TRANSPORTE PÚBLICO</h1>

        <nav className={styles.menu}>
          <Link to='/login'>
          <button className={styles.botao}>Administrador</button>
          </Link>
        </nav>
      </header>

      <section className={styles.cards}>

        <Link to='/rotas'>
        <div className={styles.card}>
          <img src={verrotas} alt='Rotas' />
          <h3>Rotas de Ônibus</h3>
          <p>Planeje sua rota e veja o melhor trajeto.</p>
          <button className={styles.blue}>Ver Rotas</button>
        </div>
        </Link>

        <Link to='/horarios'>
        <div className={styles.card}>
          <img src={verhorario} alt='Horarios' />
          <h3>Horários de Ônibus</h3>
          <p>Consulte os horários de saída e chegada.</p>
          <button className={styles.orange}>Ver Horários</button>
        </div>
        </Link>

      </section>

      <footer className={styles.footer} />
    </div>
    )
}