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

    // ✅ AGORA É STATE
    const [horarios, setHorarios] = useState([
        ["05:30", "06:00", "06:30", "07:00", "07:30"],
        ["07:30", "08:00", "08:30", "09:00", "09:30"],
        ["08:30", "09:30", "10:00"],
        ["10:30", "11:00", "11:30", "12:00", "12:30"],
        ["13:00", "13:30", "14:00", "14:30", "15:00"],
        ["15:30", "16:00", "16:30", "17:00", "17:30"],
        ["18:00", "18:30", "19:00", "19:30", "20:00"],
        ["20:30", "21:00", "21:30", "22:00"]
    ]);

    // 🗑 DELETAR LINHA
    const deletarLinha = (index) => {
        const novosHorarios = horarios.filter((_, i) => i !== index);
        setHorarios(novosHorarios);
    };

    // ➕ ADICIONAR NOVO HORÁRIO (nova linha)
    const adicionarHorario = (linhaIndex) => {
        const novo = prompt("Digite o novo horário (ex: 12:30):");
        if (!novo) return;
        const novos = [...horarios];

        novos[linhaIndex].push(novo); // ✅ adiciona na linha certa

        setHorarios(novos);
    };

    const adicionar = () => {
        const novo = prompt("Digite o novo horário (ex: 12:30):");
        if (novo) { const novos = [...horarios]; novos.push([novo]); setHorarios(novos); }
    };

    const deletarHorario = (linhaIndex, horaIndex) => {
        const novos = [...horarios]; 
        novos[linhaIndex] = novos[linhaIndex].filter((_, i) => i !== horaIndex);
        setHorarios(novos);
};

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

                {/* LADO ESQUERDO */}
                <div className={styles.ladoesquerdo}>
                    <div className={styles.barraLateral}>

                        <h3>Selecione o ponto</h3>

                        <input placeholder="Digite o nome do ponto" />

                        <ul className={styles.nomePontos}>
                            {pontos.map((ponto) => (
                                <li
                                    key={ponto}
                                    className={`${styles.item} ${ponto === pontoSelecionado ? styles.active : ""
                                        }`}
                                    onClick={() => setPontoSelecionado(ponto)}
                                >
                                    {ponto}
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>

                {/* LADO DIREITO */}
                <div className={styles.ladoDireito}>
                    <div className={styles.conteudoDireito}>
                        <h3>{pontoSelecionado}</h3>

                        <div className={styles.horarios}>
                            {horarios.map((linha, i) => (
                                <div key={i} className={styles.linha}>
                                    <div className={styles.horariosContainer}>
                                        {linha.map((hora, j) => (
                                            <span key={j} className={styles.hora}>
                                                {hora}
                                            </span>
                                        ))}
                                    </div>
                                    <div className={styles.botoes}>
                                        <button className={styles.adicionar} onClick={() => adicionarHorario(i)}>
                                            +
                                        </button>
                                        <button className={styles.delete} onClick={() => deletarLinha(i)} >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.rodape}>
                            <button className={styles.salvar} onClick={() => adicionar(0)}>
                                Adicionar
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}