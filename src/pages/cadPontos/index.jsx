import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import api from "../../services/apis";

export default function CadastroPontos() {
    const [nomePonto, setNomePonto] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    useEffect(() => {
        document.title = "Cadastro de Pontos";
    }, []);

    async function salvar() {
        if (!nomePonto || !latitude || !longitude) {
            alert("Preencha todos os campos para cadastrar o ponto.");
            return;
        }

        try {
            const { data } = await api.post("/pontos", {
                nome_dos_pontos: nomePonto,
                latitude_dos_pontos: Number(latitude),
                longitude_dos_pontos: Number(longitude),
            });

            if (!data.sucesso) {
                alert(data.mensagem || "Erro ao cadastrar ponto.");
                return;
            }

            setNomePonto("");
            setLatitude("");
            setLongitude("");

            alert("Ponto cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar ponto:", error);
            alert(
                error.response?.data?.mensagem ||
                "Erro ao cadastrar ponto."
            );
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
                                <label htmlFor="latitude">Latitude</label>
                                <input
                                    id="latitude"
                                    type="number"
                                    step="0.00000001"
                                    placeholder="Ex: -21.93325935"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="longitude">Longitude</label>
                                <input
                                    id="longitude"
                                    type="number"
                                    step="0.00000001"
                                    placeholder="Ex: -50.50249973"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
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
