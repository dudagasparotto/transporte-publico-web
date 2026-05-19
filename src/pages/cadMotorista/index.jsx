import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import api from "../../services/apis";

export default function Motorista() {

  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    document.title = "Cadastro de Motorista";
  }, []);

  function handleFoto(e) {

    const file = e.target.files[0];

    if (file) {
      setFoto(file);
    }

  }

  async function salvar() {

    if (!cpf || !cnh || !nome) {

      alert(
        "Preencha todos os campos para cadastrar o motorista."
      );

      return;

    }

    try {

      const formData = new FormData();

      formData.append("cpf_motorista", cpf);
      formData.append("cnh_motorista", cnh);
      formData.append("nome_motorista", nome);

      if (foto) {
        formData.append("foto", foto);
        formData.append("foto_motorista", foto);
      }

      const { data } = await api.post("/motoristas", formData);

      if (!data.sucesso) {
        alert(data.mensagem || "Erro ao cadastrar motorista.");
        return;
      }

      setCpf("");
      setCnh("");
      setNome("");
      setFoto(null);

      alert("Motorista cadastrado com sucesso!");

    } catch (error) {

      console.error(
        "Erro ao cadastrar motorista:",
        error
      );

      alert("Erro ao cadastrar motorista.");

    }

  }

  return (

    <div className={styles.page}>

      <div className={styles.container}>

        <header className={styles.header}>

          <h1>CADASTRO DE MOTORISTAS</h1>

          <button
            className={styles["home-btn"]}
            onClick={() => window.location.href = "/adm"}
          >
            VOLTAR
          </button>

        </header>

        <div className={styles.card}>

          <h2>Novo Motorista</h2>

          <div className={styles.content}>

            <div className={styles.form}>

              <div className={styles["form-row"]}>

                <div className={styles["form-group"]}>

                  <label>CPF</label>

                  <input
                    value={cpf}
                    onChange={(e) =>
                      setCpf(e.target.value)
                    }
                    placeholder="000.000.000-00"
                  />

                </div>

                <div className={styles["form-group"]}>

                  <label>CNH</label>

                  <input
                    value={cnh}
                    onChange={(e) =>
                      setCnh(e.target.value)
                    }
                    placeholder="Número da CNH"
                  />

                </div>

              </div>

              <div className={styles["foto-section"]}>

                <label>Foto</label>

                <div className={styles["foto-box"]}>

                  {foto ? (

                    <img
                      src={URL.createObjectURL(foto)}
                      alt="preview"
                    />

                  ) : (

                    <span>Selecionar Foto</span>

                  )}

                  <input
                    type="file"
                    onChange={handleFoto}
                  />

                </div>

              </div>

              <div className={styles["form-group"]}>

                <label>Nome Completo</label>

                <input
                  value={nome}
                  onChange={(e) =>
                    setNome(e.target.value)
                  }
                  placeholder="Nome do motorista"
                />

              </div>

              <button
                className={styles.btn}
                onClick={salvar}
              >
                Cadastrar Motorista
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
