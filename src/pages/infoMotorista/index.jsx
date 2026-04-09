import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './styles.module.css';
import motoristaImg from '../../assets/motorista.webp';


export default function InfoMotorista(){

    const navigate = useNavigate();
    const [nota, setNota] = useState (0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState('');
    
    const enviarAvaliacao =() =>{
        if(nota ==0){
            alert('Por favor, selecione uma nota para o motorista.');
            return;
        }
        alert (`Avaliação enviada com sucesso!\nNota: ${nota}\nComentário: ${comentario || 'Sem comentário'}`);
        setNota(0);
        setComentario('');
    }

      return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        {/* Topo */}
        <div className={Styles.header}>
          <button className={Styles.backButton} onClick={() => navigate(-1)}>
            HOME
          </button> {/*ARRUMAR PARA VOLTAR PARA A PÁGINA ANTERIOR*/}
          <h1>Informações do Motorista</h1>
        </div>

        <p className={Styles.subtitle}>
          Visualize os dados do motorista e registre uma avaliação.
        </p>

        {/* Dados principais */}
        <div className={Styles.profileSection}>
          <div className={Styles.avatarBox}>
            <div className={Styles.img} >
                <img src={motoristaImg.webp} alt="Motorista" className={Styles.imgMotorista}>
                </img>
            </div> {/*ARRUMAR PARA POR FOTO DO MOTORISTA*/}
          </div>

          <div className={Styles.infoBox}>
            <div className={Styles.infoItem}>
              <span className={Styles.label}>Nome</span>
              <strong>João Paulo Silva</strong>
            </div>

            <div className={Styles.infoItem}>
              <span className={Styles.label}>Linha</span>
              <strong>Azul</strong>
            </div>

            <div className={Styles.infoItem}>
              <span className={Styles.label}>Código do Motorista</span>
              <strong>MTR-4589</strong>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className={Styles.statsContainer}>

          <div className={Styles.statCard}>
            <span className={Styles.statTitle}>Avaliação média</span>
            <strong>4,8</strong>
          </div>

          <div className={Styles.statCard}>
            <span className={Styles.statTitle}>Tempo na plataforma</span>
            <strong>2 anos e 3 meses</strong>
          </div>
        </div>

        {/* Avaliação */}
        <div className={Styles.avaliacaoBox}>
          <h2>Avalie o motorista</h2>
          <p>Sua avaliação ajuda a melhorar nosso serviço.</p>

          <div className={Styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${Styles.starButton} ${
                  star <= (hover || nota) ? Styles.active : ''
                }`}
                onClick={() => setNota(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            ))}
          </div>

          <span className={Styles.noteText}>Toque nas estrelas para avaliar</span>

          <textarea
            className={Styles.textarea}
            placeholder="Deixe um comentário (opcional)..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={200}
          />

          <div className={Styles.counter}>{comentario.length}/200</div>

          <button className={Styles.primaryButton} onClick={enviarAvaliacao}>
            Enviar Avaliação/ Sugestão
          </button>

          <button
            className={Styles.secondaryButton}
            onClick={() => navigate('/avaliacaoMotorista')}
          >
            Ver avaliações anteriores
          </button>
        </div>
      </div>
    </div>
  );
}