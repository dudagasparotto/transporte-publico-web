import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './styles.module.css';

export default function AvaliacaoMotorista() {
  const navigate = useNavigate();

  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    const dados =
      JSON.parse(localStorage.getItem('avaliacoes')) || [];

    setAvaliacoes(dados);
  }, []);

  return (
    <div className={Styles.container}>

      <button
        className={Styles.botaoVoltar}
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1 className={Styles.titulo}>
        Avaliações do Motorista
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
                {"★".repeat(item.nota)}
                {"☆".repeat(5 - item.nota)}
              </div>

              <p className={Styles.comentario}>
                {item.comentario}
              </p>

            </div>
          ))
        ) : (
          <p>Nenhuma avaliação enviada ainda.</p>
        )}
      </div>

    </div>
  );
}