import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './styles.module.css';
import motoristaImg from '../../assets/motorista.webp';
import { addToCollection, getCollection, getNextId } from '../../mockup/localStorage';

export default function InfoMotorista() {
  const navigate = useNavigate();
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [motorista, setMotorista] = useState(null);

  useEffect(() => {
    const motoristas = getCollection('motoristas');
    setMotorista(motoristas[0] ?? null);
  }, []);

  const enviarAvaliacao = () => {
    if (nota === 0) {
      alert('Por favor, selecione uma nota.');
      return;
    }

    const avaliacao = {
      id: getNextId('avaliacoes'),
      nome: motorista?.nome || 'Passageiro',
      nota,
      comentario,
      data: new Date().toLocaleDateString('pt-BR'),
    };

    addToCollection('avaliacoes', avaliacao);
    alert(`Avaliação enviada!\nNota: ${nota}`);
    setNota(0);
    setComentario('');
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>

        {/* HEADER */}
        <div className={Styles.header}>
          <button onClick={() => navigate(-1)} className={Styles.backButton}>
            INÍCIO
          </button>

          <div>
            <h1>Informações do Motorista</h1>
            <p>Visualize os dados e avalie o motorista</p>
          </div>
        </div>

        {/* PERFIL */}
        <div className={Styles.profileSection}>
          <div className={Styles.imageBox}>
            <img src={motoristaImg} alt="Motorista" />
          </div>

          <div className={Styles.infoBox}>
            <h2>{motorista?.nome ?? 'Motorista'}</h2>

            <div className={Styles.infoGrid}>
              <div>
                <span>Linha</span>
                <strong>{motorista?.linha ?? 'N/A'}</strong>
              </div>

              <div>
                <span>Código</span>
                <strong>{motorista?.codigo ?? 'N/A'}</strong>
              </div>

              <div>
                <span>Tempo na plataforma</span>
                <strong>{motorista?.tempoPlataforma ?? 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className={Styles.statsContainer}>
          <div className={Styles.statCard}>
            <span>Avaliação média</span>
            <strong>⭐ 4,8</strong>
          </div>

          <div className={Styles.statCard}>
            <span>Tempo na plataforma</span>
            <strong> 2 anos e 3 meses</strong>
          </div>
        </div>

        {/* AVALIAÇÃO */}
        <div className={Styles.avaliacaoBox}>
          <h2>Avalie o motorista</h2>
          <p>Sua opinião é importante!</p>

          <div className={Styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${Styles.star} ${
                  star <= (hover || nota) ? Styles.active : ''
                }`}
                onClick={() => setNota(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Deixe um comentário..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <button className={Styles.primeiroButton} onClick={enviarAvaliacao}>
            Enviar avaliação
          </button>

          <button  className={Styles.segundoButton} onClick={() => navigate('/avaliacaoMotorista')}>
            Ver avaliações anteriores
          </button>

        </div>
      </div>
    </div>
  );
}