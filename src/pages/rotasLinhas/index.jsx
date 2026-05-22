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
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }

    carregarDados();
  }, []);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <button
          className={styles.menuButton}
          onClick={() => navigate('/')}
        >
          <Home size={26} />
          <span>HOME</span>
        </button>

        <button
          className={`${styles.menuButton} ${
            abaSelecionada === 'pontos' ? styles.menuAtivo : ''
          }`}
          onClick={() => setAbaSelecionada('pontos')}
        >
          <MapPin size={26} />
          <span>PONTOS</span>
        </button>

        <button
          className={`${styles.menuButton} ${
            abaSelecionada === 'horarios' ? styles.menuAtivo : ''
          }`}
          onClick={() => setAbaSelecionada('horarios')}
        >
          <Clock size={26} />
          <span>HORARIOS</span>
        </button>
      </aside>

      <main className={styles.conteudo}>
        <section className={styles.hero}>
          <div className={styles.heroTexto}>
            <div className={styles.heroIcone}>
              <MapPin size={36} />
            </div>

            <div>
              <h1>Rotas disponiveis</h1>
              <p>Selecione uma rota para visualizar no mapa</p>
            </div>
          </div>

          <div className={styles.heroDecoracao}>
            <div className={styles.tracoRota}></div>
            <MapPin size={82} />
          </div>
        </section>

        <section className={styles.painelMapa}>
          <div className={styles.rotasArea}>
            {rotas.map((rotaItem) => (
              <button
                key={rotaItem.id_linha}
                className={`${styles.botaoRota} ${
                  rotaSelecionada &&
                  rotaSelecionada.id_linha === rotaItem.id_linha
                    ? styles.rotaAtiva
                    : ''
                }`}
                style={{ background: rotaItem.cor }}
                onClick={() => {
                  setRotaSelecionada(rotaItem);
                  setAbaSelecionada('');
                }}
              >
                <span className={styles.bolinhaRota}></span>
                {rotaItem.nome_linha}
              </button>
            ))}
          </div>

          {abaSelecionada && (
            <div className={styles.painelDados}>
              {!rotaSelecionada ? (
                <p>Selecione uma rota para visualizar os dados.</p>
              ) : abaSelecionada === 'pontos' ? (
                <>
                  <h3>Pontos da rota {rotaSelecionada.nome_linha}</h3>

                  <div className={styles.listaDados}>
                    {rotaSelecionada.pontos.length > 0 ? (
                      rotaSelecionada.pontos.map((ponto) => (
                        <span key={ponto.id_ponto}>
                          {ponto.nome_ponto}
                        </span>
                      ))
                    ) : (
                      <p>Nenhum ponto cadastrado para esta rota.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3>Horarios da rota {rotaSelecionada.nome_linha}</h3>

                  <div className={styles.listaDados}>
                    {rotaSelecionada.pontos.map((ponto) => (
                      <div
                        key={ponto.id_ponto}
                        className={styles.itemHorario}
                      >
                        <strong>{ponto.nome_ponto}</strong>

                        <div>
                          {ponto.horarios.length > 0 ? (
                            ponto.horarios.map((horario) => (
                              <span key={horario.id_horario}>
                                {horario.hora}
                              </span>
                            ))
                          ) : (
                            <small>Sem horarios cadastrados</small>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className={styles.mapaWrapper}>
            <LeafletRouteMap
              rotaNome={rotaSelecionada ? rotaSelecionada.nome_linha : null}
              className={styles.mapa}
            />

            <div className={styles.cardCidade}>
              <div className={styles.cardCidadeIcone}>
                <MapPin size={30} />
              </div>

              <div>
                <strong>
                  {rotaSelecionada
                    ? `Rota ${rotaSelecionada.nome_linha}`
                    : 'Tupa - SP'}
                </strong>

                <p>
                  {rotaSelecionada
                    ? 'Rota selecionada no mapa.'
                    : 'Visualize as rotas disponiveis na cidade e regiao.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
