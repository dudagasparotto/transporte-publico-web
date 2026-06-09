import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Home,
  MapPin,
} from 'lucide-react';

import styles from './styles.module.css';
import { getArquivoUrl } from '../../services/apis';
import {
  listarMotoristasDaRota,
  listarRotasComPontos,
} from '../../services/transporte';
import LeafletRouteMap from '../../components/LeafletRouteMap';

function horaParaMinutos(hora) {
  if (!hora) {
    return 999999;
  }

  const [horas, minutos] = String(hora).split(':').map(Number);
  return horas * 60 + minutos;
}

function ordenarPontosPorHorario(pontos) {
  return [...pontos].sort((a, b) => {
    return menorHorarioDoPonto(a) - menorHorarioDoPonto(b);
  });
}

function menorHorarioDoPonto(ponto) {
  return Math.min(
    ...ponto.horarios.map((horario) => horaParaMinutos(horario.hora)),
    999999
  );
}

function ordenarHorarios(horarios) {
  return [...horarios].sort(
    (a, b) => horaParaMinutos(a.hora) - horaParaMinutos(b.hora)
  );
}

function getIniciais(nome) {
  if (!nome) {
    return '?';
  }

  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');
}

export default function RotasLinhas() {
  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState('');
  const [motoristasDaRota, setMotoristasDaRota] = useState([]);
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(false);
  const [erroMotoristas, setErroMotoristas] = useState('');

  const navigate = useNavigate();
  const idRotaSelecionada = rotaSelecionada?.id_rota;

  useEffect(() => {
    async function carregarDados() {
      try {
        const dataRotas = await listarRotasComPontos();
        setRotas(dataRotas);

        if (dataRotas.length > 0) {
          setRotaSelecionada(dataRotas[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    if (!idRotaSelecionada) {
      setMotoristasDaRota([]);
      return undefined;
    }

    let ativo = true;

    async function carregarMotoristas() {
      try {
        setCarregandoMotoristas(true);
        setErroMotoristas('');

        const motoristas = await listarMotoristasDaRota(idRotaSelecionada);

        if (ativo) {
          setMotoristasDaRota(motoristas);
        }
      } catch (error) {
        console.error('Erro ao carregar motoristas da rota:', error);

        if (ativo) {
          setMotoristasDaRota([]);
          setErroMotoristas('Nao foi possivel carregar os motoristas desta rota.');
        }
      } finally {
        if (ativo) {
          setCarregandoMotoristas(false);
        }
      }
    }

    carregarMotoristas();

    return () => {
      ativo = false;
    };
  }, [idRotaSelecionada]);

  const pontosComHorarios = rotaSelecionada
    ? ordenarPontosPorHorario(rotaSelecionada.pontos).filter(
        (ponto) => ponto.horarios.length > 0
      )
    : [];

  return (
    <div className={styles.container}>
      <main className={styles.conteudo}>
        <section className={styles.painelMapa}>
          <div className={styles.rotasArea}>
            <button className={styles.homeButton} onClick={() => navigate('/')}>
              <Home size={22} />
              <span>HOME</span>
            </button>

            <div className={styles.rotasGrupo}>
              <h2>Rotas disponiveis</h2>

              {rotas.map((rotaItem) => (
                <button
                  key={rotaItem.id_linha}
                  className={`${styles.botaoRota} ${
                    rotaSelecionada &&
                    rotaSelecionada.id_linha === rotaItem.id_linha
                      ? styles.rotaAtiva
                      : ''
                  }`}
                  style={{ '--cor-rota': rotaItem.cor }}
                  onClick={() => {
                    setRotaSelecionada(rotaItem);
                  }}
                >
                  {rotaItem.nome_linha}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.areaMapaDados}>
            <div className={styles.mapaWrapper}>
              <LeafletRouteMap
                rotaNome={rotaSelecionada ? rotaSelecionada.nome_mapa : null}
                pontos={rotaSelecionada ? rotaSelecionada.pontos : []}
                className={styles.mapa}
              />
            </div>

            <aside className={styles.painelDados}>
              <div className={styles.painelDadosTopo}>
                <button
                  className={`${styles.botaoPainel} ${
                    abaSelecionada === 'pontos' ? styles.botaoPainelAtivo : ''
                  }`}
                  onClick={() => setAbaSelecionada('pontos')}
                >
                  <MapPin size={22} />
                  PONTOS
                </button>

                <button
                  className={`${styles.botaoPainel} ${
                    abaSelecionada === 'horarios' ? styles.botaoPainelAtivo : ''
                  }`}
                  onClick={() => setAbaSelecionada('horarios')}
                >
                  <Clock size={22} />
                  HORARIOS
                </button>
              </div>

              {!rotaSelecionada ? (
                <p>Selecione uma rota.</p>
              ) : abaSelecionada === 'pontos' ? (
                <>
                  <h3>Pontos</h3>
                  <strong className={styles.nomeRota}>
                    Rota {rotaSelecionada.nome_linha}
                  </strong>

                  <div className={styles.listaDados}>
                    {rotaSelecionada.pontos.length > 0 ? (
                      ordenarPontosPorHorario(rotaSelecionada.pontos).map(
                        (ponto, index) => (
                          <div
                            key={ponto.id_ponto}
                            className={styles.itemPonto}
                          >
                            <span>{index + 1}</span>

                            <div>
                              <strong>{ponto.nome_ponto}</strong>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p>Nenhum ponto cadastrado.</p>
                    )}
                  </div>
                </>
              ) : abaSelecionada === 'horarios' ? (
                <>
                  <h3>Horarios</h3>
                  <strong className={styles.nomeRota}>
                    Rota {rotaSelecionada.nome_linha}
                  </strong>

                  <div className={styles.listaDados}>
                    {pontosComHorarios.length > 0 ? (
                      pontosComHorarios.map(
                        (ponto) => (
                          <div
                            key={ponto.id_ponto}
                            className={styles.itemHorario}
                          >
                            <strong>{ponto.nome_ponto}</strong>

                            <div className={styles.horariosPonto}>
                              {ordenarHorarios(ponto.horarios).map(
                                (horario) => (
                                  <span key={horario.id_horario}>
                                    {horario.hora}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p>Nenhum horario cadastrado.</p>
                    )}
                  </div>
                </>
              ) : (
                <p>Clique em pontos ou horarios para ver os dados da rota.</p>
              )}

              {rotaSelecionada && (
                <section className={styles.motoristasRota}>
                  <h3>Motoristas ativos nesta rota</h3>

                  {carregandoMotoristas ? (
                    <p>Carregando motoristas...</p>
                  ) : erroMotoristas ? (
                    <p className={styles.erroDados}>{erroMotoristas}</p>
                  ) : motoristasDaRota.length > 0 ? (
                    <div className={styles.listaMotoristas}>
                      {motoristasDaRota.map((motorista) => (
                        <Link
                          key={motorista.id_motorista}
                          to={`/infoMotorista/${motorista.id_motorista}`}
                          className={styles.motoristaItem}
                        >
                          {motorista.foto ? (
                            <img
                              src={getArquivoUrl(motorista.foto)}
                              alt={motorista.nome}
                              className={styles.motoristaFoto}
                            />
                          ) : (
                            <div className={styles.motoristaAvatar}>
                              {getIniciais(motorista.nome)}
                            </div>
                          )}

                          <div className={styles.motoristaInfo}>
                            <strong>{motorista.nome || 'Motorista'}</strong>
                            <span>{motorista.status || 'Ativo'}</span>
                          </div>

                          <span className={styles.motoristaMedia}>
                            {Number(motorista.media_avaliacao || 0) > 0
                              ? Number(motorista.media_avaliacao).toFixed(1)
                              : 'Sem nota'}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p>Nenhum motorista ativo vinculado a esta rota.</p>
                  )}
                </section>
              )}
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
