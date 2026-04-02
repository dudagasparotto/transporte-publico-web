import { Link } from "react-router";

import './styles.css'

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
          <Link to='/rotas'>
          <div className="card">
          <img src="https://www.figma.com/api/mcp/asset/74a470de-ceb1-4aaa-a213-e6e3c40a7789" />
          <h3>Pontos de Ônibus</h3>
          <p>Encontre os pontos de ônibus mais próximos.</p>
          <button className="green">Ver Pontos</button>
        </div>
        </Link>

        <Link to='/rotas'>
        <div className="card">
          <img src="https://www.figma.com/api/mcp/asset/f1d4ce75-9bb6-4f66-98cb-8485f76220bd" />
          <h3>Rotas de Ônibus</h3>
          <p>Planeje sua rota e veja o melhor trajeto.</p>
          <button className="blue">Ver Rotas</button>
        </div>
        </Link>
        <Link to='/horarios'>
        <div className="card">
          <img src="https://www.figma.com/api/mcp/asset/6706dbc5-7975-426a-8a87-793eb120beb3" />
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