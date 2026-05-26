import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Home,
  MapPin,
} from 'lucide-react';

import styles from './styles.module.css';
import { listarRotasComPontos } from '../../services/transporte';
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

export default function RotasLinhas() {
  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState('');

  const navigate = useNavigate();

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
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
