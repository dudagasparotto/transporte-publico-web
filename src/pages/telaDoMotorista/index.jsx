import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles.module.css';
import api from '../../services/apis';

export default function TelaDoMotorista() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [motorista, setMotorista] = useState(null);
    const [rotas, setRotas] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState('rotas');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [resMotorista, resRotas, resAvaliacoes] = await Promise.all([
                    api.get(`/motoristas/${id}`),
                    api.get(`/rotas/motorista/${id}`),
                    api.get(`/avaliacoes/motorista/${id}`)
                ]);

                setMotorista(resMotorista.data.dados);
                setRotas(resRotas.data.dados || []);
                setAvaliacoes(resAvaliacoes.data.dados || []);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [id]);

    function renderEstrelas(nota) {
        const total = 5;
        return Array.from({ length: total }, (_, i) => (
            <span
                key={i}
                className={i < Math.round(nota) ? styles.estrelaCheia : styles.estrelaVazia}
            >
                ★
            </span>
        ));
    }

    function mediaAvaliacoes() {
        if (avaliacoes.length === 0) return '—';
        const soma = avaliacoes.reduce((acc, a) => acc + Number(a.nota), 0);
        return (soma / avaliacoes.length).toFixed(1);
    }

    function getIniciais(nome) {
        if (!nome) return '?';
        return nome
            .split(' ')
            .slice(0, 2)
            .map(p => p[0].toUpperCase())
            .join('');
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

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.avatarArea}>
                        {motorista?.foto ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/fotos/motoristas/${motorista.foto}`}
                                alt={motorista.nome_motorista}
                                className={styles.avatarFoto}
                            />
                        ) : (
                            <div className={styles.avatarIniciais}>
                                {getIniciais(motorista?.nome_motorista)}
                            </div>
                        )}
                        <div className={styles.headerInfo}>
                            <span className={styles.boasVindas}>Bem-vindo de volta</span>
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
                            <span className={styles.statLabel}>Média</span>
                        </div>
                        <div className={styles.statDivisor}></div>
                        <div className={styles.statItem}>
                            <span className={styles.statValor}>{avaliacoes.length}</span>
                            <span className={styles.statLabel}>Avaliações</span>
                        </div>
                    </div>

                    <button
                        className={styles.botaoSair}
                        onClick={() => navigate('/')}
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* Abas */}
            <nav className={styles.abas}>
                <button
                    className={`${styles.aba} ${abaAtiva === 'rotas' ? styles.abaAtiva : ''}`}
                    onClick={() => setAbaAtiva('rotas')}
                >
                    🗺️ Minhas Rotas
                </button>
                <button
                    className={`${styles.aba} ${abaAtiva === 'avaliacoes' ? styles.abaAtiva : ''}`}
                    onClick={() => setAbaAtiva('avaliacoes')}
                >
                    ⭐ Avaliações
                </button>
            </nav>

            {/* Conteúdo */}
            <main className={styles.conteudo}>

                {/* Aba Rotas */}
                {abaAtiva === 'rotas' && (
                    <section className={styles.secao}>
                        {rotas.length === 0 ? (
                            <div className={styles.vazio}>
                                <span className={styles.vazioCone}>🚌</span>
                                <p>Nenhuma rota atribuída no momento.</p>
                            </div>
                        ) : (
                            <div className={styles.listaRotas}>
                                {rotas.map((rota) => (
                                    <div key={rota.id_rota ?? rota.id} className={styles.cardRota}>
                                        <div className={styles.rotaNumero}>
                                            {rota.numero_rota ?? rota.linha ?? '—'}
                                        </div>
                                        <div className={styles.rotaInfo}>
                                            <h3 className={styles.rotaNome}>
                                                {rota.nome_rota ?? rota.nome ?? 'Rota sem nome'}
                                            </h3>
                                            <div className={styles.rotaPercurso}>
                                                <span className={styles.parada}>
                                                    📍 {rota.origem ?? rota.ponto_inicial ?? 'Origem'}
                                                </span>
                                                <span className={styles.setaPercurso}>→</span>
                                                <span className={styles.parada}>
                                                    🏁 {rota.destino ?? rota.ponto_final ?? 'Destino'}
                                                </span>
                                            </div>
                                            {rota.horario && (
                                                <span className={styles.horario}>
                                                    🕐 {rota.horario}
                                                </span>
                                            )}
                                            {rota.status && (
                                                <span className={`${styles.badge} ${styles[`badge_${rota.status?.toLowerCase()}`] ?? styles.badge_ativo}`}>
                                                    {rota.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Aba Avaliações */}
                {abaAtiva === 'avaliacoes' && (
                    <section className={styles.secao}>

                        {avaliacoes.length > 0 && (
                            <div className={styles.resumoAvaliacoes}>
                                <div className={styles.mediaGrande}>
                                    <span className={styles.mediaNumero}>{mediaAvaliacoes()}</span>
                                    <div className={styles.mediaEstrelas}>
                                        {renderEstrelas(parseFloat(mediaAvaliacoes()))}
                                    </div>
                                    <span className={styles.mediaSub}>
                                        Baseado em {avaliacoes.length} avaliação{avaliacoes.length !== 1 ? 'ões' : ''}
                                    </span>
                                </div>
                            </div>
                        )}

                        {avaliacoes.length === 0 ? (
                            <div className={styles.vazio}>
                                <span className={styles.vazioCone}>⭐</span>
                                <p>Nenhuma avaliação recebida ainda.</p>
                            </div>
                        ) : (
                            <div className={styles.listaAvaliacoes}>
                                {avaliacoes.map((avaliacao, index) => (
                                    <div key={avaliacao.id_avaliacao ?? index} className={styles.cardAvaliacao}>
                                        <div className={styles.avaliacaoTopo}>
                                            <div className={styles.avaliacaoEstrelas}>
                                                {renderEstrelas(avaliacao.nota)}
                                            </div>
                                            <span className={styles.avaliacaoNota}>
                                                {Number(avaliacao.nota).toFixed(1)}
                                            </span>
                                        </div>
                                        {avaliacao.comentario && (
                                            <p className={styles.avaliacaoComentario}>
                                                "{avaliacao.comentario}"
                                            </p>
                                        )}
                                        <div className={styles.avaliacaoRodape}>
                                            {avaliacao.nome_passageiro && (
                                                <span className={styles.avaliacaoPassageiro}>
                                                    👤 {avaliacao.nome_passageiro}
                                                </span>
                                            )}
                                            {avaliacao.data_avaliacao && (
                                                <span className={styles.avaliacaoData}>
                                                    {new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
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
