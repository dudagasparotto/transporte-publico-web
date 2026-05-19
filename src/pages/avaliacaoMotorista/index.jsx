import React, {useEffect, useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import Styles from './styles.module.css';
import api from '../../services/apis';

export default function AvaliacaoMotorista() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [avaliacoes, setAvaliacoes] = useState([]);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {

    async function carregarAvaliacoes() {

      try {

        const { data } = await api.get(`/avaliacao/${id}`);

        if (data.sucesso) {
          setAvaliacoes(data.dados);
        }

      } 
      catch (error) {

        console.error(
          'Erro ao carregar avaliações:',
          error
        );
      } 

      finally {
        setCarregando(false);
      }
    }

    carregarAvaliacoes();

    },
  [id]);

  return (
    <div className={Styles.container}>

      <button
        className={Styles.botaoVoltar}
        onClick={() => navigate(-1)}
      >
        VOLTAR
      </button>

      <h1 className={Styles.titulo}>
        Avaliações do motorista
      </h1>

      <p className={Styles.subtitulo}>
        Veja os comentários enviados
      </p>

      <div className={Styles.listaAvaliacoes}>

        {carregando ? (

          <p>Carregando...</p>

        ) : avaliacoes.length > 0 ? (

          avaliacoes.map((item, index) => (

            <div
              key={item.id_avaliacao}
              className={Styles.card}
            >

              <div className={Styles.topoCard}>

                <h3>
                  Avaliação   {index + 1}
                </h3>

                <span className={Styles.data}>
                  {
                    new Date(
                      item.data_avaliacao
                    ).toLocaleDateString('pt-BR')
                  }
                </span>

              </div>

              <div className={Styles.estrelas}>

                {'★'.repeat(
                  item.nota_avaliacao
                )}

                {'☆'.repeat(
                  5 - item.nota_avaliacao
                )}

              </div>

              <p className={Styles.comentario}>

                {item.comentario_avaliacao}

              </p>

            </div>

          ))

        ) : (

          <p className={Styles.semAvaliacao}>
            Nenhuma avaliação encontrada
          </p>

        )}

      </div>

    </div>

  );

}
