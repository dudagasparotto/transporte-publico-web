import { Link } from "react-router";

import "./styles.css";

import pontos from "../../assets/pontos.png";
import rotas from "../../assets/rotas.png";
import horarios from "../../assets/horarios.png";


export default function HomeAdm() {
  return (
    <div className="admin-container">
      
      <header className="admin-header">
        <h1 className="h1">TRANSPORTE PÚBLICO</h1>

        <nav>
          <Link to='/'>
            <button className="botao">Home</button>
          </Link>
        </nav>
      </header>

      <div className="overlay" />

      <main className="admin-content">
        
        <div className="admin-card">
          <img src={pontos} />
          <h3>Pontos de Ônibus</h3>
          <Link to='/adm/editarpontos'>
            <button>Editar</button>
          </Link>
        </div>

        <div className="admin-card">
          <img src={horarios} />
          <h3>Horários</h3> 
          <Link to='/adm/editarhorarios'>
            <button>Editar</button>
          </Link>
        </div>

        <div className="admin-card">
          <img src={rotas} />
          <h3>Rotas</h3>
          <Link to='/adm/editarrota'>
            <button>Editar</button>
          </Link>
        </div>

        <div className="admin-card">
          <div className="icon">👮</div>
          <h3>Motoristas</h3>
          <Link to='/adm/cadmotora'>
            <button>Editar</button>
          </Link>
        </div>

      </main>
    </div>
  );
}