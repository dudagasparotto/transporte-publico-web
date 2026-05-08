import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Styles from './styles.module.css';

export default function InfoMotorista() {

  const navigate = useNavigate();
  const location = useLocation();

  const motorista = location.state;

  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [media, setMedia] = useState(0);
  const [mostrarAlert, setMostrarAlert] = useState(false);
  const [mensagemAlert, setMensagemAlert] = useState('');

  useEffect(() => {

    if (!motorista) {
      navigate(-1);
      return;
    }

    calcularMedia();

  }, []);

  async function calcularMedia() {

    try {

      const response = await fetch(
        'http://localhost:3000/avaliacoes'
      );

      const data = await response.json();

      const avaliacoesMotorista =
        data.dados.filter(
          (item) =>
            item.id_motorista ===
            motorista.id_motorista
        );

      if (avaliacoesMotorista.length === 0) {
        setMedia(0);
        return;
      }

      const soma =
        avaliacoesMotorista.reduce(
          (total, item) =>
            total + item.nota_avaliacao,
          0
        );

      const resultado =
        soma / avaliacoesMotorista.length;

      setMedia(resultado.toFixed(1));

    } catch (error) {

      console.error(
        'Erro ao calcular média:',
        error
      );

    }

  }

  const mostrarMensagem = (texto) => {

    setMensagemAlert(texto);
    setMostrarAlert(true);

    setTimeout(() => {
      setMostrarAlert(false);
    }, 2500);

  };

  async function enviarAvaliacao() {

    if (nota === 0) {

      mostrarMensagem(
        '⚠️ Selecione uma nota.'
      );

      return;

    }

    try {

      const response = await fetch(
        'http://localhost:3000/avaliacoes',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            id_motorista:
              motorista.id_motorista,

            nota_avaliacao: nota,

            comentario_avaliacao:
              comentario,

            data_avaliacao:
              new Date()
                .toISOString()
                .split('T')[0],
          }),
        }
      );

      const data = await response.json();

      if (data.sucesso) {

        mostrarMensagem(
          '✅ Avaliação enviada com sucesso!'
        );

        setNota(0);
        setComentario('');

        calcularMedia();

      }

    } catch (error) {

      console.error(
        'Erro ao enviar avaliação:',
        error
      );

    }

  }

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
            <h1>
              Informações do Motorista
            </h1>

            <p>
              Visualize os dados e avalie
              o motorista
            </p>
          </div>

        </div>

        <div className={Styles.profileSection}>

          <div className={Styles.imageBox}>

            <img
              src={
                motorista?.foto_motorista
              }
              alt={
                motorista?.nome_motorista
              }
            />

          </div>

          <div className={Styles.infoBox}>

            <h2>
              {
                motorista?.nome_motorista
              }
            </h2>

            <div className={Styles.infoGrid}>

              <div>
                <span>ID</span>

                <strong>
                  {
                    motorista?.id_motorista
                  }
                </strong>
              </div>

              <div>
                <span>CPF</span>

                <strong>
                  {
                    motorista?.cpf_motorista
                  }
                </strong>
              </div>

              <div>
                <span>CNH</span>

                <strong>
                  {
                    motorista?.cnh_motorista
                  }
                </strong>
              </div>

            </div>

          </div>

        </div>

        <div className={Styles.statsContainer}>

          <div className={Styles.statCard}>

            <span>
              Avaliação média
            </span>

            <strong>
              ⭐ {media}
            </strong>

          </div>

          <div className={Styles.statCard}>

            <strong>
              Em serviço
            </strong>

          </div>

        </div>

        <div className={Styles.avaliacaoBox}>

          <h2>
            Avalie o motorista
          </h2>

          <p>
            Sua opinião é importante!
          </p>

          <div className={Styles.stars}>

            {[1, 2, 3, 4, 5].map(
              (star) => (

                <span
                  key={star}
                  className={`${
                    Styles.star
                  } ${
                    star <=
                    (hover || nota)
                      ? Styles.active
                      : ''
                  }`}
                  onClick={() =>
                    setNota(star)
                  }
                  onMouseEnter={() =>
                    setHover(star)
                  }
                  onMouseLeave={() =>
                    setHover(0)
                  }
                >
                  ★
                </span>

              )
            )}

          </div>

          <textarea
            placeholder="Deixe um comentário..."
            value={comentario}
            onChange={(e) =>
              setComentario(
                e.target.value
              )
            }
          />

          <button
            className={
              Styles.primeiroButton
            }
            onClick={enviarAvaliacao}
          >
            Enviar avaliação
          </button>

          <button
            className={
              Styles.segundoButton
            }
            onClick={() =>
              navigate(
                '/avaliacaoMotorista',
                {
                  state: motorista,
                }
              )
            }
          >
            Ver avaliações anteriores
          </button>

        </div>

      </div>

    </div>
  );
}