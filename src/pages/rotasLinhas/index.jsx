import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';
import api, { getArquivoUrl } from '../../services/apis';
import { listarRotasComPontos } from '../../services/transporte';
import LeafletRouteMap from '../../components/LeafletRouteMap';

export default function RotasLinhas() {

  const [rotas, setRotas] = useState([]);
  const [linha, setLinha] = useState(null);

  const [motoristas, setMotoristas] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    async function carregarDados() {

      try {

        const dataRotas = await listarRotasComPontos();
        setRotas(dataRotas);

        setLinha(
          dataRotas[0]?.nome_linha || null
        );

        const { data: dataMotoristas } =
          await api.get('/motoristas');

        setMotoristas(
          dataMotoristas.dados
        );

      } catch (error) {

        console.error(
          'Erro ao carregar dados:',
          error
        );

      }

    }

    carregarDados();

  }, []);

  return (

    <div className={styles.container}>

      <header className={styles.header}>

        <button
          className={styles.Button}
          onClick={() => navigate('/')}>
          HOME
        </button>

      </header>

      <main className={styles.main}>

        <section className={styles.mapaSection}>

          <div className={styles.mapaWrapper}>

            {linha && (

              <LeafletRouteMap
                rotaNome={linha}
                className={styles.mapa}
              />

            )}

          </div>

        </section>

        <aside className={styles.infoPanel}>

          <h2 className={styles.subtitulo}>
            Rotas disponíveis
          </h2>

          {rotas.map((rotaItem) => (

            <button
              key={rotaItem.id_rota}
              className={styles.Button}
              onClick={() =>
                setLinha(rotaItem.nome_linha)
              }
            >

              <div>
                {rotaItem.nome_linhas?.toUpperCase()}
              </div>

            </button>

          ))}

          <h2 className={styles.subtitulo}>
            Descrição das rotas:
          </h2>

          <div className={styles.descricaoRotas}>

            {rotas.map((rotaItem) => (

              <div
                key={rotaItem.id}
                className={
                  styles.descricaoItens
                }
              >

                <h4
                  className={
                    styles.descricaoItem
                  }
                >
                  {rotaItem.nome_linhas}
                </h4>

                <p
                  className={
                    styles.descricaoItem
                  }
                >
                  Início: {rotaItem.saida}
                </p>

                <p
                  className={
                    styles.descricaoItem}>
                  Fim: {rotaItem.destino} </p>

                <p
                  className={
                    styles.descricaoItem
                  }>
                  Paradas:{' '}
                  {rotaItem.paradas?.join(
                    ', '
                  )}
                </p>

              </div>

            ))}

          </div>

          <div className={styles.card}>

            <h3> Escolha o motorista para fazer
              uma avaliação: </h3>

            {motoristas.map((m) => (

              <div
                key={m.id_motorista}
                className={styles.driverItem}
                onClick={() =>
                  navigate(
                    `/infoMotorista/${m.id_motorista}`,
                    {
                      state: {
                        id_motorista:
                          m.id_motorista,

                        nome_motorista:
                          m.nome_motorista,

                        cpf_motorista:
                          m.cpf_motorista,

                        cnh_motorista:
                          m.cnh_motorista,

                        foto_motorista:
                          m.foto_motorista
                      }
                    }
                  )
                }
              >

                <div className={styles.fotoMotorista}>

                  <img
                    src={getArquivoUrl(m.foto_motorista)}
                    alt={m.nome_motorista}
                  />

                </div>

                <strong className={styles.driverName}>
                  {m.nome_motorista}
                </strong>

                <span className={styles.status}>
                  Em serviço
                </span>

              </div>

            ))}
          </div>
        </aside>
      </main>
    </div>

  );

}
