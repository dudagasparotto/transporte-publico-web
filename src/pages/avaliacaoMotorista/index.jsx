import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Styles from './styles.module.css';

export default function AvaliacaoMotorista() {
  const navigate = useNavigate();
  const location = useLocation();

  const motorista = location.state;

  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    if (!motorista) {
      navigate(-1);
      return;
    }

    const chave = `avaliacoes_${motorista.codigo}`;

    const dados =
      JSON.parse(localStorage.getItem(chave)) || [];

    setAvaliacoes(dados);
  }, []);

  return (
    <div className={Styles.container}>

      <button
        className={Styles.botaoVoltar}
        onClick={() => navigate(-1)}
      >
        VOLTAR
      </button>

      <h1 className={Styles.titulo}>
        Avaliações de {motorista?.nome}
      </h1>

      <p className={Styles.subtitulo}>
        Veja o que os passageiros estão dizendo
      </p>

      <div className={Styles.listaAvaliacoes}>
        {avaliacoes.length > 0 ? (
          avaliacoes.map((item, index) => (
            <div key={index} className={Styles.card}>

              <div className={Styles.topoCard}>
                <h3>{item.nome}</h3>

                <span className={Styles.data}>
                  {item.data}
                </span>
              </div>

              <div className={Styles.estrelas}>
                {'★'.repeat(item.nota)}
                {'☆'.repeat(5 - item.nota)}
              </div>

              <p className={Styles.comentario}>
                {item.comentario || 'Sem comentário'}
              </p>

            </div>
          ))
        ) : (
          <p className={Styles.semAvaliacao}>
            Nenhuma avaliação enviada ainda.
          </p>
        )}
      </div>

    </div>
  );
}