import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function EditarHorarios() {

    const navigate = useNavigate();

    const [linhaSelecionada, setLinhaSelecionada] = useState(0);
    const [pontoSelecionado, setPontoSelecionado] = useState("");
    const [horarios, setHorarios] = useState([]);
    const [filtroPonto, setFiltroPonto] = useState("");

    const [abrirModalPonto, setAbrirModalPonto] = useState(false);
    const [nomeNovoPonto, setNomeNovoPonto] = useState("");
    const [horarioInicial, setHorarioInicial] = useState("");

    const [abrirModalHorario, setAbrirModalHorario] = useState(false);
    const [novoHorario, setNovoHorario] = useState("");

    const [abrirModalSalvar, setAbrirModalSalvar] = useState(false);
    const [mensagemSalvar, setMensagemSalvar] = useState("");

    useEffect(() => {

        const dados =
            JSON.parse(localStorage.getItem("horarios")) || [];

        setHorarios(dados);

        if (dados.length > 0) {
            setPontoSelecionado(
                dados[0]?.pontos?.[0]?.nome ?? ""
            );
        }

    }, []);

    const linhaAtual =
        horarios[linhaSelecionada] || {
            linha: "",
            pontos: []
        };

    const pontosFiltrados = linhaAtual.pontos.filter((ponto) =>
        ponto.nome
            .toLowerCase()
            .includes(filtroPonto.toLowerCase())
    );

    const persistirHorarios = (novosHorarios) => {

        setHorarios(novosHorarios);

        localStorage.setItem(
            "horarios",
            JSON.stringify(novosHorarios)
        );
    };

    const deletarLinha = (index) => {

        const copia = structuredClone(horarios);

        copia[linhaSelecionada].pontos =
            copia[linhaSelecionada].pontos.filter(
                (_, i) => i !== index
            );

        persistirHorarios(copia);
    };

    
    const adicionarHorario = (pontoIndex) => {

        setPontoIndexSelecionado(pontoIndex);
        setAbrirModalHorario(true);
    };


    const salvarNovoHorario = () => {
    if (!novoHorario) return;

    const copia = structuredClone(horarios);

    copia[linhaSelecionada]
        .pontos[pontoIndexSelecionado]
        .horarios.push(novoHorario);

    persistirHorarios(copia);

    setNovoHorario("");

    setAbrirModalHorario(false);
       
    };

    const salvarNovoPonto = () => {

         if (!nomeNovoPonto || !horarioInicial) return;

    const copia = [...horarios];

    copia[linhaSelecionada].pontos.push({
        nome: nomeNovoPonto,
        horarios: [horarioInicial]
    });

    setHorarios(copia);
    localStorage.setItem(
        "horarios",
        JSON.stringify(copia)
    );

    setNomeNovoPonto("");
    setHorarioInicial("");

    setAbrirModalPonto(false);
  }

    const adicionarPonto = () => {
        setAbrirModalPonto(true);
    };

    const deletarHorario = (pontoIndex, horaIndex) => {

        const copia = structuredClone(horarios);

        copia[linhaSelecionada].pontos[pontoIndex].horarios =
            copia[linhaSelecionada].pontos[pontoIndex].horarios.filter(
                (_, i) => i !== horaIndex
            );

        persistirHorarios(copia);
    };

    const salvarHorarios = () => {

        localStorage.setItem(
            "horarios",
            JSON.stringify(horarios)
        );

        setMensagemSalvar("Horários salvos com sucesso!");
        setAbrirModalSalvar(true);
    };

    return (

        <div className={styles.imagemFundo}>

            <div className={styles.header}>

                <h1 className={styles.titulinho}>
                    PAINEL ADMINISTRATIVO- EDITAR HORÁRIOS
                </h1>

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

                                setLinhaSelecionada(
                                    Number(e.target.value)
                                );

                                setPontoSelecionado(
                                    horarios[
                                        Number(e.target.value)
                                    ]?.pontos?.[0]?.nome ?? ""
                                );
                            }}
                        >

                            {horarios.map((linha, index) => (

                                <option
                                    key={linha.id ?? index}
                                    value={index}
                                >
                                    {linha.linha}
                                </option>

                            ))}

                        </select>

                        <label>Filtrar ponto:</label>

                        <input
                            className={styles.input}
                            value={filtroPonto}
                            onChange={(e) =>
                                setFiltroPonto(e.target.value)
                            }
                            placeholder="Digite o nome do ponto"
                        />

                        <ul className={styles.nomePontos}>

                            {pontosFiltrados.map((ponto) => (

                                <li
                                    key={ponto.nome}
                                    className={`${styles.item} ${
                                        ponto.nome === pontoSelecionado
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setPontoSelecionado(ponto.nome)
                                    }
                                >
                                    {ponto.nome}
                                </li>

                            ))}

                        </ul>

                    </div>

                </div>

                <div className={styles.ladoDireito}>

                    <div className={styles.conteudoDireito}>

                        <h3>
                            {linhaAtual.linha ||
                                "Nenhuma linha selecionada"}
                        </h3>

                        <div className={styles.horarios}>

                            {linhaAtual.pontos.map((ponto, pontoIndex) => (

                                <div
                                    key={ponto.nome}
                                    className={styles.linha}
                                >

                                    <div className={styles.horariosContainer}>

                                        <strong className={styles.nomePontos}>
                                            {ponto.nome}
                                        </strong>

                                        {ponto.horarios.map((hora, horaIndex) => (

                                            <span
                                                key={horaIndex}
                                                className={styles.hora}
                                            >

                                                {hora}

                                                <button
                                                    className={styles.delete}
                                                    onClick={() =>
                                                        deletarHorario(
                                                            pontoIndex,
                                                            horaIndex
                                                        )
                                                    }
                                                    style={{
                                                        marginLeft: '8px'
                                                    }}
                                                >
                                                    ✕
                                                </button>

                                            </span>

                                        ))}

                                    </div>

                                    <div className={styles.botoes}>

                                        <button
                                            className={styles.adicionar}
                                            onClick={() =>
                                                adicionarHorario(
                                                    pontoIndex
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                        <button
                                            className={styles.delete}
                                            onClick={() =>
                                                deletarLinha(
                                                    pontoIndex
                                                )
                                            }
                                        >
                                            🗑
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                        <div className={styles.rodape}>

                            <button
                                className={styles.adicionarPonto}
                                onClick={adicionarPonto}
                            >
                                Adicionar Ponto
                            </button>

                            <button
                                className={styles.adicionarPonto}
                                onClick={salvarHorarios}
                            >
                                Salvar Horários
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* MODAL PONTO */}

            {abrirModalPonto && (

                <div className={styles.overlay}>

                    <div className={styles.modal}>

                        <h2>Novo ponto</h2>

                        <input
                            className={styles.inputModal}
                            type="text"
                            placeholder="Nome do ponto"
                            value={nomeNovoPonto}
                            onChange={(e) =>
                                setNomeNovoPonto(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            className={styles.inputModal}
                            type="text"
                            placeholder="Horário inicial"
                            value={horarioInicial}
                            onChange={(e) =>
                                setHorarioInicial(
                                    e.target.value
                                )
                            }
                        />

                        <div className={styles.modalButtons}>

                            <button
                                className={styles.cancelar}
                                onClick={() =>
                                    setAbrirModalPonto(false)
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                className={styles.salvarModal}
                                onClick={salvarNovoPonto}
                            >
                                Salvar
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* MODAL HORÁRIO */}

            {abrirModalHorario && (

                <div className={styles.overlay}>

                    <div className={styles.modal}>

                        <h2>Novo horário</h2>

                        <input
                            className={styles.inputModal}
                            type="text"
                            placeholder="Digite o horário"
                            value={novoHorario}
                            onChange={(e) =>
                                setNovoHorario(
                                    e.target.value
                                )
                            }
                        />

                        <div className={styles.modalButtons}>

                            <button
                                className={styles.cancelar}
                                onClick={() =>
                                    setAbrirModalHorario(false)
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                className={styles.salvarModal}
                                onClick={salvarNovoHorario}
                            >
                                Salvar
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* MODAL SALVAR */}

            {abrirModalSalvar && (

                <div className={styles.overlay}>

                    <div className={styles.modalSalvar}>

                        <div className={styles.iconeSucesso}>
                            ✓
                        </div>

                        <h2>Sucesso</h2>

                        <p>{mensagemSalvar}</p>

                        <button
                            className={styles.botaoOk}
                            onClick={() =>
                                setAbrirModalSalvar(false)
                            }
                        >
                            OK
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}