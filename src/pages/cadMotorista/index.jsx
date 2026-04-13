import { useState } from "react";
import "./styles.css";

export default function Motorista() {
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState(null);

  function handleFoto(e) {
    const file = e.target.files[0];
    if (file) {
      setFoto(URL.createObjectURL(file));
    }
  }

  function salvar() {
    const motorista = { cpf, cnh, nome };
    console.log("Motorista:", motorista);
  }

  return (
    <div className="container">

      <header className="header">
        <h1>Painel Administrativo</h1>
        <span>Cadastro de Motorista</span>
      </header>

      <div className="card">

        <h2>Novo Motorista</h2>

        <div className="form">

          <div className="form-group">
            <label>CPF</label>
            <input
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>

          <div className="form-group">
            <label>CNH</label>
            <input
              value={cnh}
              onChange={(e) => setCnh(e.target.value)}
              placeholder="Número da CNH"
            />
          </div>

          {/* FOTO */}
          <div className="foto-section">
            <label>Foto</label>

            <div className="foto-box">
              {foto ? (
                <img src={foto} alt="preview" />
              ) : (
                <span>Selecionar Foto</span>
              )}
              <input type="file" onChange={handleFoto} />
            </div>
          </div>

          <div className="form-group">
            <label>Nome Completo</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do motorista"
            />
          </div>

          <button className="btn" onClick={salvar}>
            Cadastrar Motorista
          </button>

        </div>
      </div>
    </div>
  );
}