//DUDA

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './styles.module.css';

export default function AvaliacaoMotorista() {
  const navigate = useNavigate();

  const avaliacoes = [
    {
      nome: "Maria Souza",
      nota: 5,
      comentario: "Motorista muito educado e pontual!",
      data: "10/04/2026"
    },
    {
      nome: "Carlos Lima",
      nota: 4,
      comentario: "Dirige bem, mas poderia ser mais simpático.",
      data: "08/04/2026"
    },
    {
      nome: "Ana Clara",
      nota: 5,
      comentario: "Excelente profissional, viagem tranquila.",
      data: "05/04/2026"
    }
  ];

  return (
    <div className={Styles.container}>

      <button 
        className={Styles.botaoVoltar}
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1 className={Styles.titulo}>Avaliações do Motorista</h1>
      <p className={Styles.subtitulo}>
        Veja o que os passageiros estão dizendo
      </p>

      <div className={Styles.listaAvaliacoes}>
        {avaliacoes.map((item, index) => (
          <div key={index} className={Styles.card}>

            <div className={Styles.topoCard}>
              <h3>{item.nome}</h3>
              <span className={Styles.data}>{item.data}</span>
            </div>

            <div className={Styles.estrelas}>
              {"★".repeat(item.nota)}
              {"☆".repeat(5 - item.nota)}
            </div>

            <p className={Styles.comentario}>
              {item.comentario}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}