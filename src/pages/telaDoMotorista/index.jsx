import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './styles.module.css';
import api, { getArquivoUrl } from '../../services/apis';
import { encerrarSessao } from '../../services/auth';
import {
    listarRotasComPontos,
    listarVinculosRotaMotorista,
} from '../../services/transporte';

function mesmoId(idA, idB) {
    return Number(idA) === Number(idB);
}

function dadosDaResposta(resposta) {
    return resposta?.data?.dados ?? resposta?.data ?? null;
}

function listaDaResposta(resposta) {
    const dados = dadosDaResposta(resposta);

    if (Array.isArray(dados)) return dados;
    if (Array.isArray(dados?.dados)) return dados.dados;
    if (Array.isArray(dados?.avaliacoes)) return dados.avaliacoes;
    if (Array.isArray(dados?.avaliacao)) return dados.avaliacao;

    return [];
}

export default function TelaDoMotorista() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [motorista, setMotorista] = useState(null);
    const [rotas, setRotas] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState('rotas');
    const [carregando, setCarregando] = useState(true);
    const [mediaApi, setMediaApi] = useState(0);
    const [erro, setErro] = useState('');

    function fazerLogout() {
        encerrarSessao();
        navigate('/loginmotorista', { replace: true });
    }

    useEffect(() => {
        async function carregarDados() {
            const idMotorista = Number(id);

            if (!Number.isFinite(idMotorista)) {
                setErro('Motorista nao encontrado.');
                setCarregando(false);
                return;
            }

            try {
                const [
                    motoristaEncontrado,
                    todasRotas,
                    vinculos,
                    avaliacoesData,
                    mediaData
                ] = await Promise.all([
                    carregarMotorista(idMotorista),
                    listarRotasComPontos(),
                    listarVinculosRotaMotorista(),
                    carregarAvaliacoes(idMotorista),
                    carregarMedia(idMotorista)
                ]);

                const rotasDoMotorista = filtrarRotasDoMotorista(
                    todasRotas || [],
                    vinculos || [],
                    idMotorista
                );

                setMotorista(motoristaEncontrado);
                setRotas(rotasDoMotorista);
                setAvaliacoes(avaliacoesData);
                setMediaApi(mediaData);
                setErro('');
            } catch (error) {
                console.error('Erro ao carregar tela do motorista:', error);
                setErro('Nao foi possivel carregar seus dados.');
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [id]);

    async function carregarMotorista(idMotorista) {
        try {
            const resposta = await api.get(`/motoristas/${idMotorista}`);
            const dados = dadosDaResposta(resposta);

            if (dados && !Array.isArray(dados)) {
                return dados;
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Erro ao carregar motorista pelo id:', error);
            }
        }

        const { data } = await api.get('/motoristas');
        const motoristas = data.dados || [];

        return (
            motoristas.find((item) => mesmoId(item.id_motorista, idMotorista)) ||
            null
        );
    }

    async function carregarAvaliacoes(idMotorista) {
        try {
            const resposta = await api.get(`/avaliacao/${idMotorista}`);
            return listaDaResposta(resposta);
        } catch (error) {
            console.error('Erro ao carregar avaliacoes do motorista:', error);
            return [];
        }
    }

    async function carregarMedia(idMotorista) {
        try {
            const { data } = await api.get(`/mediaAvaliacao/${idMotorista}`);
            return data.media || data.dados?.media || 0;
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Erro ao carregar media:', error);
            }

            return 0;
        }
    }

    function filtrarRotasDoMotorista(todasRotas, vinculos, idMotorista) {
        const idsRotasDoMotorista = vinculos
            .filter((vinculo) => mesmoId(vinculo.id_motorista, idMotorista))
            .map((vinculo) => Number(vinculo.id_rota));

        return todasRotas.filter((rota) => {
            const motoristaDaRota = rota.motorista;
            const rotaVinculada = idsRotasDoMotorista.some((idRota) =>
                mesmoId(idRota, rota.id_rota)
            );
            const motoristaVinculado =
                motoristaDaRota && mesmoId(motoristaDaRota.id_motorista, idMotorista);

            return rotaVinculada || motoristaVinculado;
        });
    }

    function getIniciais(nome) {
        if (!nome) return '?';

        return nome
            .split(' ')
            .slice(0, 2)
            .map((parte) => parte[0].toUpperCase())
            .join('');
    }

    function mediaAvaliacoes() {
        if (mediaApi) return Number(mediaApi).toFixed(1);
        if (avaliacoes.length === 0) return '-';

        const soma = avaliacoes.reduce(
            (total, avaliacao) => total + Number(avaliacao.nota_avaliacao || 0),
            0
        );

        return (soma / avaliacoes.length).toFixed(1);
    }

    function horariosDaRota(rota) {
        return (rota.pontos || [])
            .flatMap((ponto) => ponto.horarios || [])
            .map((horario) => horario.hora)
            .filter(Boolean)
            .sort();
    }

    function renderEstrelas(nota) {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={
                    index < Math.round(Number(nota || 0))
                        ? styles.estrelaCheia
                        : styles.estrelaVazia
                }
            >
                ★
            </span>
        ));
    }

    if (carregando) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className={styles.loadingContainer}>
                <p>{erro}</p>
                <button className={styles.botaoSair} onClick={() => navigate('/')}>
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.avatarArea}>
                        {motorista?.foto_motorista ? (
                            <img
                                src={getArquivoUrl(motorista.foto_motorista)}
                                alt={motorista.nome_motorista}
                                className={styles.avatarFoto}
                            />
                        ) : (
                            <div className={styles.avatarIniciais}>
                                {getIniciais(motorista?.nome_motorista)}
                            </div>
                        )}

                        <div className={styles.headerInfo}>
                            <span className={styles.boasVindas}>
                                Bem-vindo de volta
                            </span>
                            <h1 className={styles.nomeMotorista}>
                                {motorista?.nome_motorista ?? 'Motorista'}
                            </h1>
                            <span className={styles.idTag}>ID #{id}</span>
                        </div>
                    </div>

                    <div className={styles.headerStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValor}>{rotas.length}</span>
                            <span className={styles.statLabel}>Rotas</span>
                        </div>
                        <div className={styles.statDivisor}></div>
                        <div className={styles.statItem}>
                            <span className={styles.statValor}>{mediaAvaliacoes()}</span>
                            <span className={styles.statLabel}>Media</span>
                        </div>
                        <div className={styles.statDivisor}></div>
                        <div className={styles.statItem}>
                            <span className={styles.statValor}>{avaliacoes.length}</span>
                            <span className={styles.statLabel}>Avaliacoes</span>
                        </div>
                    </div>

                    <button className={styles.botaoSair} onClick={fazerLogout}>
                        Sair
                    </button>
                </div>
            </header>

            <nav className={styles.abas}>
                <button
                    className={`${styles.aba} ${
                        abaAtiva === 'rotas' ? styles.abaAtiva : ''
                    }`}
                    onClick={() => setAbaAtiva('rotas')}
                >
                    Minhas Rotas
                </button>

                <button
                    className={`${styles.aba} ${
                        abaAtiva === 'avaliacoes' ? styles.abaAtiva : ''
                    }`}
                    onClick={() => setAbaAtiva('avaliacoes')}
                >
                    Avaliacoes
                </button>
            </nav>

            <main className={styles.conteudo}>
                {abaAtiva === 'rotas' && (
                    <section className={styles.secao}>
                        {rotas.length === 0 ? (
                            <div className={styles.vazio}>
                                <span className={styles.vazioCone}>Rotas</span>
                                <p>Nenhuma rota cadastrada no momento.</p>
                            </div>
                        ) : (
                            <div className={styles.listaRotas}>
                                {rotas.map((rota) => {
                                    const horarios = horariosDaRota(rota);

                                    return (
                                    <div
                                        key={rota.id_linha ?? rota.id_rota}
                                        className={styles.cardRota}
                                    >
                                        <div className={styles.rotaNumero}>
                                            {rota.nome_linha?.slice(0, 2) || '--'}
                                        </div>

                                        <div className={styles.rotaInfo}>
                                            <h3 className={styles.rotaNome}>
                                                Rota {rota.nome_linha || 'sem nome'}
                                            </h3>

                                            <div className={styles.rotaPercurso}>
                                                <span className={styles.parada}>
                                                    {rota.saida || 'Origem nao cadastrada'}
                                                </span>
                                                <span className={styles.setaPercurso}>→</span>
                                                <span className={styles.parada}>
                                                    {rota.destino || 'Destino nao cadastrado'}
                                                </span>
                                            </div>

                                            <div className={styles.rotaDetalhes}>
                                                <span className={styles.horario}>
                                                    <strong>
                                                        {rota.pontos?.length || 0}
                                                    </strong>
                                                    pontos cadastrados
                                                </span>

                                                <span className={styles.horario}>
                                                    <span className={styles.infoRotulo}>
                                                        Proximo horario
                                                    </span>
                                                    <strong>
                                                        {horarios[0] || 'Nao informado'}
                                                    </strong>
                                                </span>

                                                <span className={`${styles.badge} ${styles.badge_ativo}`}>
                                                    <span className={styles.statusIndicador} />
                                                    Ativa
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {abaAtiva === 'avaliacoes' && (
                    <section className={styles.secao}>
                        {avaliacoes.length > 0 && (
                            <div className={styles.resumoAvaliacoes}>
                                <div className={styles.mediaGrande}>
                                    <span className={styles.mediaNumero}>
                                        {mediaAvaliacoes()}
                                    </span>
                                    <div className={styles.mediaEstrelas}>
                                        {renderEstrelas(mediaAvaliacoes())}
                                    </div>
                                    <span className={styles.mediaSub}>
                                        Baseado em {avaliacoes.length} avaliacao
                                        {avaliacoes.length !== 1 ? 'es' : ''}
                                    </span>
                                </div>
                            </div>
                        )}

                        {avaliacoes.length === 0 ? (
                            <div className={styles.vazio}>
                                <span className={styles.vazioCone}>Notas</span>
                                <p>Nenhuma avaliacao recebida ainda.</p>
                            </div>
                        ) : (
                            <div className={styles.listaAvaliacoes}>
                                {avaliacoes.map((avaliacao) => (
                                    <div
                                        key={avaliacao.id_avaliacao}
                                        className={styles.cardAvaliacao}
                                    >
                                        <div className={styles.avaliacaoTopo}>
                                            <div className={styles.avaliacaoEstrelas}>
                                                {renderEstrelas(avaliacao.nota_avaliacao)}
                                            </div>
                                            <span className={styles.avaliacaoNota}>
                                                {Number(avaliacao.nota_avaliacao).toFixed(1)}
                                            </span>
                                        </div>

                                        {avaliacao.comentario_avaliacao && (
                                            <p className={styles.avaliacaoComentario}>
                                                "{avaliacao.comentario_avaliacao}"
                                            </p>
                                        )}

                                        {avaliacao.data_avaliacao && (
                                            <div className={styles.avaliacaoRodape}>
                                                <span className={styles.avaliacaoData}>
                                                    {new Date(
                                                        avaliacao.data_avaliacao
                                                    ).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
