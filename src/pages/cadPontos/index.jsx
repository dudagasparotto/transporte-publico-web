import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function CadastroPontos() {
    const [nomePonto, setNomePonto] = useState("");
    const [sentido, setSentido] = useState("bairro");
    const [localizacao, setLocalizacao] = useState("");

    useEffect(() => {
        document.title = "Cadastro de Pontos";
    }, []);

    async function salvar() {
        if (!nomePonto || !sentido || !localizacao) {
            alert("Preencha todos os campos para cadastrar o ponto.");
            return;
        }

        try {
            // AQUI VAI SUA API
            // exemplo:
            /*
            const response = await fetch(
                "http://localhost:3000/pontos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: nomePonto,
                        sentido: sentido,
                        localizacao: localizacao,
                    }),
                }
            );

            const data = await response.json();
            */

            setNomePonto("");
            setSentido("bairro");
            setLocalizacao("");

            alert("Ponto cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar ponto:", error);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Cadastro de Pontos</h1>
                </div>

                <div className={styles.card}>
                    <div className={styles.content}>
                        <form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="nomePonto">Nome do Ponto</label>
                                <input
                                    id="nomePonto"
                                    type="text"
                                    placeholder="Ex: Ponto Central"
                                    value={nomePonto}
                                    onChange={(e) => setNomePonto(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="sentido">Sentido</label>
                                <select
                                    id="sentido"
                                    value={sentido}
                                    onChange={(e) => setSentido(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="bairro">Bairro</option>
                                    <option value="centro">Centro</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="localizacao">Localização</label>
                                <input
                                    id="localizacao"
                                    type="text"
                                    placeholder="Ex: Rua Principal, 123"
                                    value={localizacao}
                                    onChange={(e) => setLocalizacao(e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className={styles.btn}
                                onClick={salvar}
                            >
                                Cadastrar Ponto
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}