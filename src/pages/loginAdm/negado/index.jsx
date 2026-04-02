import "./styles.css";

export default function Negado() {
  return (
    <div className="negado-container">
      <div className="overlay" />

      <div className="negado-box">
        <div className="icon">🔒</div>

        <h1>Acesso negado</h1>

        <p>
          Você não possui permissão para acessar esta funcionalidade.
        </p>
        
        <button onClick={() => window.history.back()}>
          Voltar
        </button>
      </div>
    </div>
  );
}