import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";
import { getCollection, updateCollection } from "../../mockup/localStorage";

export default function EditarHorarios() {
    const navigate = useNavigate();
    const [linhaSelecionada, setLinhaSelecionada] = useState(0);
    const [pontoSelecionado, setPontoSelecionado] = useState("");
    const [horarios, setHorarios] = useState([]);
    const [filtroPonto, setFiltroPonto] = useState("");

    useEffect(() => {
        const dados = getCollection("horarios");
        setHorarios(dados);
        if (dados.length > 0) {
            setPontoSelecionado(dados[0]?.pontos?.[0]?.nome ?? "");
        }
    }, []);

    const linhaAtual = horarios[linhaSelecionada] || { linha: "", pontos: [] };
    const pontosFiltrados = linhaAtual.pontos.filter((ponto) =>
        ponto.nome.toLowerCase().includes(filtroPonto.toLowerCase())
    );

    const persistirHorarios = (novosHorarios) => {
        setHorarios(novosHorarios);
        updateCollection("horarios", novosHorarios);
    };

    const deletarLinha = (index) => {
        const copia = structuredClone(horarios);
        copia[linhaSelecionada].pontos = copia[linhaSelecionada].pontos.filter((_, i) => i !== index);
        persistirHorarios(copia);
    };

    const adicionarHorario = (pontoIndex) => {
        const novo = prompt("Digite o novo horário (ex: 12:30):");
        if (!novo) return;

        const copia = structuredClone(horarios);
        copia[linhaSelecionada].pontos[pontoIndex].horarios.push(novo);
        persistirHorarios(copia);
    };

    const adicionarPonto = () => {
        const nome = prompt("Digite o nome do novo ponto:");
        if (!nome) return;
        const horarioInicial = prompt("Digite o horário inicial (ex: 12:30):");
        if (!horarioInicial) return;

        const copia = structuredClone(horarios);
        copia[linhaSelecionada].pontos.push({ nome, horarios: [horarioInicial] });
        persistirHorarios(copia);
    };

    const deletarHorario = (pontoIndex, horaIndex) => {
        const copia = structuredClone(horarios);
        copia[linhaSelecionada].pontos[pontoIndex].horarios = copia[linhaSelecionada].pontos[pontoIndex].horarios.filter((_, i) => i !== horaIndex);
        persistirHorarios(copia);
    };

    const salvarHorarios = () => {
        updateCollection("horarios", horarios);
        alert("Horários salvos com sucesso!");
    };

    return (
        <div className={styles.imagemFundo}>
            <div className={styles.header}>
                <h1 className={styles.titulinho}>PAINEL ADMINISTRATIVO- EDITAR HORÁRIOS</h1>

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
                        <h3>Selecione a linha</h3>

                        <label>Escolher linha:</label>
                        <select
                            className={styles.select}
                            value={linhaSelecionada}
                            onChange={(e) => {
                                setLinhaSelecionada(Number(e.target.value));
                                setPontoSelecionado(horarios[Number(e.target.value)]?.pontos?.[0]?.nome ?? "");
                            }}
                        >
                            {horarios.map((linha, index) => (
                                <option key={linha.id ?? index} value={index}>
                                    {linha.linha}
                                </option>
                            ))}
                        </select>

                        <label>Filtrar ponto:</label>
                        <input
                            className={styles.input}
                            value={filtroPonto}
                            onChange={(e) => setFiltroPonto(e.target.value)}
                            placeholder="Digite o nome do ponto"
                        />

                        <ul className={styles.nomePontos}>
                            {pontosFiltrados.map((ponto) => (
                                <li
                                    key={ponto.nome}
                                    className={`${styles.item} ${ponto.nome === pontoSelecionado ? styles.active : ""}`}
                                    onClick={() => setPontoSelecionado(ponto.nome)}
                                >
                                    {ponto.nome}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.ladoDireito}>
                    <div className={styles.conteudoDireito}>
                        <h3>{linhaAtual.linha || "Nenhuma linha selecionada"}</h3>

                        <div className={styles.horarios}>
                            {linhaAtual.pontos.map((ponto, pontoIndex) => (
                                <div key={ponto.nome} className={styles.linha}>
                                    <div className={styles.horariosContainer}>
                                        <strong>{ponto.nome}</strong>
                                        {ponto.horarios.map((hora, horaIndex) => (
                                            <span key={horaIndex} className={styles.hora}>
                                                {hora}
                                                <button
                                                    className={styles.delete}
                                                    onClick={() => deletarHorario(pontoIndex, horaIndex)}
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className={styles.botoes}>
                                        <button className={styles.adicionar} onClick={() => adicionarHorario(pontoIndex)}>
                                            +
                                        </button>
                                        <button className={styles.delete} onClick={() => deletarLinha(pontoIndex)}>
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.rodape}>
                            <button className={styles.salvar} onClick={adicionarPonto}>
                                Adicionar Ponto
                            </button>
                            <button className={styles.salvar} onClick={salvarHorarios} style={{ marginLeft: '12px' }}>
                                Salvar Horários
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}