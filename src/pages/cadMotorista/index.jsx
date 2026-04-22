import { useState } from "react"; 
import styles from "./styles.module.css";

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


    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <h1>CADASTRO DE MOTORISTAS</h1>

          <button 
            className={styles["home-btn"]} 
            onClick={() => window.location.href = "/adm"}
          > VOLTAR</button>
        </header>

        <div className={styles.card}>

          <h2>Novo Motorista</h2>

          <div className={styles.content}>

            {/* FORM */}
            <div className={styles.form}>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>CPF</label>
                  <input
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>CNH</label>
                  <input
                    value={cnh}
                    onChange={(e) => setCnh(e.target.value)}
                    placeholder="Número da CNH"
                  />
                </div>
              </div>

              <div className={styles["foto-section"]}>
                <label>Foto</label>

                <div className={styles["foto-box"]}>
                  {foto ? (
                    <img src={foto} alt="preview" />
                  ) : (
                    <span>Selecionar Foto</span>
                  )}
                  <input type="file" onChange={handleFoto} />
                </div>
              </div>

              <div className={styles["form-group"]}>
                <label>Nome Completo</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do motorista"
                />
              </div>

              <button className={styles.btn} onClick={salvar}>
                Cadastrar Motorista
              </button>

            </div>

          </div>
        </div>
      </div>
      </div>
  );
}