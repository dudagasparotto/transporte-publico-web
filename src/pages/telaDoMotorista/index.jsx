import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './styles.module.css';
import api, { getArquivoUrl } from '../../services/apis';
import { listarRotasComPontos } from '../../services/transporte';

export default function TelaDoMotorista() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [motorista, setMotorista] = useState(null);
    const [rotas, setRotas] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState('rotas');
    const [carregando, setCarregando] = useState(true);
    const [mediaApi, setMediaApi] = useState(0);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    motoristaResp,
                    rotasData,
                    avaliacoesResp,
                    mediaResp
                ] = await Promise.all([
                    api.get(`/motoristas/${id}`),
                    listarRotasComPontos(),
                    api.get(`/avaliacao/${id}`),
                    api.get(`/mediaAvaliacao/${id}`)
                ]);

                setMotorista(motoristaResp.data.dados);
                setRotas(rotasData || []);
                setAvaliacoes(avaliacoesResp.data.dados || []);
                setMediaApi(mediaResp.data.media || 0);
            } catch (error) {
                console.error('Erro ao carregar tela do motorista:', error);
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [id]);

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

                    <button className={styles.botaoSair} onClick={() => navigate('/')}>
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
                                {rotas.map((rota) => (
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

                                            <span className={styles.horario}>
                                                {rota.pontos?.length || 0} pontos cadastrados
                                            </span>

                                            <span className={`${styles.badge} ${styles.badge_ativo}`}>
                                                Ativa
                                            </span>
                                        </div>
                                    </div>
                                ))}
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
