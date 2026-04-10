import { Link } from "react-router";
import "./styles.css";

export default function LoginAdm() {
  return (
    <div className="login-container">
      
      <div className="overlay" />

      {/* BOTÃO HOME */}
      <div className="top-bar">
        <Link to="/">
          <button className="home-btn">Home</button>
        </Link>
      </div>

      <div className="login-box">
        <h1>Entrar</h1>

        <div className="input-group">
          <label>Nome de usuário</label>
          <input type="text" placeholder="Digite seu usuário" />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />
        </div>

        <Link to="/adm">
          <button className="login-btn">Entrar</button>
        </Link>
      </div>
    </div>
  );
}