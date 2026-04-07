import { Link } from "react-router";

import './styles.css'
import verhorario from '../../assets/horarios.png';
import verrotas from '../../assets/rotas.png';
import verpontos from '../../assets/pontos.png';

export default function Home() {
    return (
        <div className="container">
      <header className="header">
        <h1>TRANSPORTE PÚBLICO</h1>

        <nav className="menu">
          <Link to='/login'>
          <button className="admin">Administrador</button>
          </Link>
        </nav>
      </header>

      <section className="banner" />

      <section className="cards">
          <Link to='/pontos'>
          <div className="card">
          <img src={verpontos} alt='Pontos' />
          <h3>Pontos de Ônibus</h3>
          <p>Encontre os pontos de ônibus mais próximos.</p>
          <button className="green">Ver Pontos</button>
        </div>
        </Link>

        <Link to='/rotas'>
        <div className="card">
          <img src={verrotas} alt='Rotas' />
          <h3>Rotas de Ônibus</h3>
          <p>Planeje sua rota e veja o melhor trajeto.</p>
          <button className="blue">Ver Rotas</button>
        </div>
        </Link>
        <Link to='/horarios'>
        <div className="card">
          <img src={verhorario} alt='Horarios' />
          <h3>Horários de Ônibus</h3>
          <p>Consulte os horários de saída e chegada.</p>
          <button className="orange">Ver Horários</button>
        </div>
        </Link>
      </section>

      <footer className="footer" />
    </div>
    )
}