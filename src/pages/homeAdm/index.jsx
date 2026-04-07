import "./styles.css";

import pontos from "../../assets/pontos.png";
import rotas from "../../assets/rotas.png";
import horarios from "../../assets/horarios.png";

export default function HomeAdm() {
  return (
    <div className="admin-container">
      
      <header className="admin-header">
        <h1>TRANSPORTE PÚBLICO</h1>

        <nav>
          <button>HORÁRIOS</button>
          <button>LINHAS</button>
          <button>PONTOS</button>
          <button className="admin">Administrador</button>
        </nav>
      </header>

      <div className="overlay" />

      <main className="admin-content">
        
        <div className="admin-card">
          <img src={pontos} />
          <h3>Pontos de Ônibus</h3>
          <button>Editar</button>
        </div>

        <div className="admin-card">
          <img src={horarios} />
          <h3>Horários</h3>
          <button>Editar</button>
        </div>

        <div className="admin-card">
          <img src={rotas} />
          <h3>Rotas</h3>
          <button>Editar</button>
        </div>

        <div className="admin-card">
          <div className="icon">👮</div>
          <h3>Motoristas</h3>
          <button>Editar</button>
        </div>

      </main>
    </div>
  );
}