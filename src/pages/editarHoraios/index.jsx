import styles from "./styles.module.css";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export default function EditarHorarios() {
   
    const navigate = useNavigate();

    const [pontoSelecionado, setPontoSelecionado] = useState("101 Vila Nova"); 

    const pontos = [
        "101 Vila Nova",
        "102 Morada Verde", 
        "201 Santo Antônio",
        "202 Novo Horizonte",
        "301 Residencial",
        "302 Parque Sul",
        "303 Centro Norte",
    ];

    const horarios = [
        ["06:00", "07:00", "08:00"],
        ["09:00", "10:00", "11:00"]
    ];

    return (
        <div className={styles.imagemFundo}> 

            <div className={styles.header}> 
                <h1 className={styles.titulinho}>Editar Horários</h1>

                <button 
                    className={styles.button} 
                    onClick={() => navigate('/adm')}
                >
                    VOLTAR
                </button> 
            </div>

            <div className={styles.conteudo}> 
            <div className={styles.ladoesquerdo}>
                <div className={styles.barraLateral}>
                     
                    <h3>Selecione o ponto</h3>

                    <input 
                        placeholder="Digite o nome do ponto"
                        className={styles.input}
                    />

                    <ul className={styles.nomePontos}>
                        {pontos.map((ponto) => (
                            <li 
                                key={ponto}
                                className={`${styles.item} ${
                                    ponto === pontoSelecionado ? styles.active : ""
                                }`}
                                onClick={() => setPontoSelecionado(ponto)}
                            >
                                {ponto}
                            </li>
                        ))}
                    </ul>
                
                </div>
            </div>

            <div className={styles.ladoDireito}> 
                <div className={styles.conteudoDireito}>
                    <h3>{pontoSelecionado}</h3>

                    <div className={styles.horarios}>
                        {horarios.map((linha, i) => (
                            <div key={i} className={styles.linha}>
                                {linha.map((hora, j) => (
                                    <span key={j} className={styles.hora}>
                                        {hora}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>

                </div> *
            </div>

            </div>
        </div>
    );
}
