import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bus,
  Headphones,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';

import styles from './index.module.css';
import verrotas from '../../assets/rotas.png';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcone}>
            <Bus size={40} />
          </span>

          <strong>OminiBus</strong>
        </Link>

        <nav className={styles.menu}>
          <Link to="/loginmotorista" className={styles.menuBotao}>
            <User size={26} />
            Motorista
          </Link>

          <Link to="/loginadm" className={styles.menuBotao}>
            <ShieldCheck size={27} />
            Administrador
          </Link>
        </nav>
      </header>

      <main className={styles.hero}>
        <section className={styles.chamada}>
          <h1>
            Seu caminho,
            <span> nossa missão.</span>
          </h1>

          <div className={styles.linhaTitulo}></div>

          <p>
            Planeje suas rotas e acompanhe os horários de forma simples,
            rápida e intuitiva.
          </p>

          <div className={styles.infoBox}>
            <span>
              <Users size={33} />
            </span>

            <div>
              <strong>Para todos, todos os dias.</strong>
              <small>Motoristas, gestores e passageiros.</small>
            </div>
          </div>
        </section>

        <section className={styles.cardRotas}>
          <img src={verrotas} alt="Mapa com rota de ônibus" />

          <p>
            Planeje sua rota e veja o
            <strong> melhor trajeto.</strong>
          </p>

          <Link to="/rotas" className={styles.botaoRotas}>
            Ver Rotas
            <ArrowRight size={31} />
          </Link>
        </section>
      </main>

      <div className={styles.suporteUsuario}>
        <button
          className={styles.suporteBotao}
          type="button"
          aria-label="Abrir contato de suporte"
        >
          <Headphones size={30} />
        </button>

        <div className={styles.suportePainel} role="status">
          <strong>Suporte ao usuário</strong>

          <a href="mailto:suporte@ominibus.com.br">
            <Mail size={18} />
            suporte@ominibus.com.br
          </a>

          <a href="tel:+5518999999999">
            <Phone size={18} />
            (18) 99999-9999
          </a>
        </div>
      </div>

    </div>
  );
}
