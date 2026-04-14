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

    return (
        <div className={styles.imagemFundo}> 
            <div className={styles.header}> 
                <h1 className={styles.titulinho}>Editar Horários</h1>
                <button className={styles.button} onClick={() => navigate('/adm')}>
                    VOLTAR
                </button> 
            </div>

            <div className={styles.ladoesquerdo}>
                <div className={styles.barraLateral}>
                     
                    <h3>Selecione o ponto</h3>
                    <div className= {styles.nomePontos}>  </div>
                    <input placeholder='Digite o nome do ponto'/>

                    <ul>
                        {pontos.map((ponto) => (
                            <li 
                                key={ponto}
                                className={ponto === pontoSelecionado ? "active" : ""}
                                onClick={() => setPontoSelecionado(ponto)}
                            >
                                {ponto}
                            </li>
                            
                        ))}
                    </ul>
                
                </div>
            </div>
        </div>
    );
}