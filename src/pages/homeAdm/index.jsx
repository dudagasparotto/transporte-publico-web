import { Link, useNavigate } from "react-router-dom";
import { Bus, Clock, ListChecks, LogOut, Map, MapPin, UserRoundPlus } from "lucide-react";
import styles from "./index.module.css";
import { encerrarSessao } from "../../services/auth";

import pontos from "../../assets/pontos.png";
import rotas from "../../assets/rotas.png";
import horarios from "../../assets/horarios.png";

export default function HomeAdm() {
  const navigate = useNavigate();

  function fazerLogout() {
    encerrarSessao();
    navigate("/loginadm", { replace: true });
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1 className={styles.h1}>
          <Bus size={30} />
          Painel Administrativo
        </h1>

        <nav>
          <button className={styles.botao} onClick={fazerLogout}>
            <LogOut size={18} />
            Sair
          </button>
        </nav>
      </header>

      <div className={styles.overlay} />

      <main className={styles.adminContent}>
        <section className={styles.adminIntro}>
          <span>Transporte Publico</span>
          <h2>Escolha uma area para gerenciar</h2>
          <p>
            Atualize pontos, horarios, rotas e motoristas pelo painel central
            do sistema.
          </p>
        </section>

        <div className={styles.adminGrid}>
          <div className={styles.adminCard}>
            <img src={pontos} alt="Pontos de onibus" />
            <h3>Pontos de Onibus</h3>
            <p>Cadastre e ajuste os locais de parada das linhas.</p>
            <Link to="/adm/editarpontos">
              <button>
                <MapPin size={18} />
                Editar pontos
              </button>
            </Link>
          </div>

          <div className={styles.adminCard}>
            <img src={horarios} alt="Horarios" />
            <h3>Horarios</h3>
            <p>Gerencie os horarios de passagem por ponto.</p>
            <Link to="/adm/editarhorarios">
              <button>
                <Clock size={18} />
                Editar horarios
              </button>
            </Link>
          </div>

          <div className={styles.adminCard}>
            <img src={rotas} alt="Rotas" />
            <h3>Rotas</h3>
            <p>Organize linhas, trajetos e pontos no mapa.</p>
            <Link to="/adm/editarrota">
              <button>
                <Map size={18} />
                Editar rotas
              </button>
            </Link>
          </div>

          <div className={styles.adminCard}>
            <div className={styles.icon}>
              <UserRoundPlus size={82} />
            </div>
            <h3>Motoristas</h3>
            <p>Cadastre motoristas e mantenha os dados atualizados.</p>
            <Link to="/adm/cadmotora">
              <button>
                <UserRoundPlus size={18} />
                Cadastrar
              </button>
            </Link>

            <Link to="/adm/motoristas">
              <button>
                <ListChecks size={18} />
                Ver motoristas
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
