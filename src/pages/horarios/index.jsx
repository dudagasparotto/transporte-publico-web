import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { listarRotasComPontos } from '../../services/transporte';

export default function Horarios() {

  const [linhas, setLinhas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    async function carregarHorarios() {

      try {

        const dados = await listarRotasComPontos();
        setLinhas(dados);

      } catch (error) {

        console.error(
          'Erro ao carregar horários:',
          error
        );

      }

    }

    carregarHorarios();

  }, []);

  return (

    <div className={styles.fundo}>

      <div className={styles.overlay} />

      <div className={styles.header}>

        <h1 className={styles.titulinho}>
          Horários
        </h1>

        <button
          className={styles.button}
          onClick={() => navigate('/')}
        >
          HOME
        </button>

      </div>

      <div className={styles.container}>

        {linhas.map((linha) => (

          <div
            key={linha.id_linha}
            className={styles.linha}
          >

            <h2 className={styles.tituloLinha}>
              {linha.nome_linha}
            </h2>

            {linha.pontos.map((ponto, index) => (

              <div
                key={index}
                className={styles.card}
              >

                <div className={styles.topo}>

                  <span className={styles.nome}>
                    {ponto.nome_ponto}
                  </span>

                </div>

                <div className={styles.horarios}>

                  {ponto.horarios.map(
                    (hora, i) => (

                      <span
                        key={i}
                        className={styles.hora}
                      >
                        {hora}
                      </span>

                    )
                  )}

                </div>

              </div>

            ))}

          </div>

        ))}

      </div>

    </div>

  );

}
