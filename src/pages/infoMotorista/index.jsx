import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Styles from './styles.module.css';
import motoristaImg from '../../assets/motorista.webp';

export default function InfoMotorista() {
  const navigate = useNavigate();
  const location = useLocation();

  const motorista = location.state || {
    nome: 'Motorista não selecionado',
    nota: 0,
    status: 'Indisponível',
    linha: '-',
    codigo: '-',
    tempoPlataforma: '-'
  };

  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [media, setMedia] = useState(0);
  const [mostrarAlert, setMostrarAlert] = useState(false);
  const [mensagemAlert, setMensagemAlert] = useState('');

  useEffect(() => {
    if (!location.state) {
      navigate('/RotasLinhas');
      return;
    }

    calcularMedia();
  }, []);

  const calcularMedia = () => {
    const avaliacoes =
      JSON.parse(localStorage.getItem('avaliacoes')) || [];

    if (avaliacoes.length === 0) {
      setMedia(0);
      return;
    }
    const soma = avaliacoes.reduce(
      (total, item) => total + item.nota,0
    );
    const resultado = soma / avaliacoes.length;
    setMedia(resultado.toFixed(1));
  };

  const mostrarMensagem = (texto) => {
    setMensagemAlert(texto);
    setMostrarAlert(true);
    setTimeout(() => {
      setMostrarAlert(false);
    }, 2500);
  };

  const enviarAvaliacao = () => {
    if (nota === 0) {
      mostrarMensagem('⚠️ Selecione uma nota.');
      return;
    }

    const novaAvaliacao = {
      nome: 'Usuário',
      nota,
      comentario,
      data: new Date().toLocaleDateString('pt-BR')
    };

    const avaliacoesSalvas =
      JSON.parse(localStorage.getItem('avaliacoes')) || [];
      avaliacoesSalvas.unshift(novaAvaliacao);
      localStorage.setItem(
        'avaliacoes',
        JSON.stringify(avaliacoesSalvas)
    );

    mostrarMensagem('✅ Avaliação enviada com sucesso!');

    setNota(0);
    setComentario('');

    calcularMedia();
  };

  return (
    <div className={Styles.container}>

      {mostrarAlert && (
        <div className={Styles.alertOverlay}>
          <div className={Styles.customAlert}>
            {mensagemAlert}
          </div>
        </div>
      )}

      <div className={Styles.card}>

        <div className={Styles.header}>
          <button
            onClick={() => navigate(-1)}
            className={Styles.backButton}
          >
            VOLTAR
          </button>

          <div>
            <h1>Informações do Motorista</h1>
            <p>Visualize os dados e avalie o motorista</p>
          </div>
        </div>

        <div className={Styles.profileSection}>
          <div className={Styles.imageBox}>
            <img src={motoristaImg} alt="Motorista" />
          </div>

          <div className={Styles.infoBox}>
            <h2>{motorista.nome}</h2>

            <div className={Styles.infoGrid}>
              <div>
                <span>Linha</span>
                <strong>{motorista.linha}</strong>
              </div>

              <div>
                <span>Código</span>
                <strong>{motorista.codigo}</strong>
              </div>

              <div>
                <span>Tempo na plataforma</span>
                <strong>{motorista.tempoPlataforma}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={Styles.statsContainer}>
          <div className={Styles.statCard}>
            <span>Avaliação média</span>
            <strong>⭐ {media}</strong>
          </div>

          <div className={Styles.statCard}>
            <span>Status</span>
            <strong>{motorista.status}</strong>
          </div>
        </div>

        <div className={Styles.avaliacaoBox}>
          <h2>Avalie o motorista</h2>
          <p>Sua opinião é importante!</p>

          <div className={Styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${Styles.star} ${
                  star <= (hover || nota)
                    ? Styles.active
                    : ''
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
            onChange={(e) =>
              setComentario(e.target.value)
            }
          />

          <button
            className={Styles.primeiroButton}
            onClick={enviarAvaliacao}
          >
            Enviar avaliação
          </button>

          <button
            className={Styles.segundoButton}
            onClick={() =>
              navigate('/avaliacaoMotorista')
            }
          >
            Ver avaliações anteriores
          </button>

        </div>
      </div>
    </div>
  );
}