import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  useNavigate,
  useParams
} from 'react-router-dom';

import Styles from './styles.module.css';
import api, { getArquivoUrl } from '../../services/apis';

export default function InfoMotorista() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [motorista, setMotorista] =
    useState(null);

  const [nota, setNota] = useState(0);

  const [hover, setHover] =
    useState(0);

  const [comentario, setComentario] =
    useState('');

  const [media, setMedia] =
    useState(0);

  const [mostrarAlert, setMostrarAlert] =
    useState(false);

  const [mensagemAlert, setMensagemAlert] =
    useState('');

  const [carregando, setCarregando] =
    useState(true);

  const carregarMotorista = useCallback(async function carregarMotorista() {

    try {

      const { data } = await api.get(
        `/motoristas/${id}`
      );

      if (data.sucesso) {

        setMotorista(data.dados);

      }

    } catch (error) {

      console.error(
        'Erro ao carregar motorista:',
        error
      );

    } finally {

      setCarregando(false);

    }

  }, [id]);

  const calcularMedia = useCallback(async function calcularMedia() {

    try {

      const { data } = await api.get('/avaliacoes');

      if (data.sucesso) {
        const avaliacoes = (data.dados || []).filter(
          (item) => Number(item.id_motorista) === Number(id)
        );
        const soma = avaliacoes.reduce(
          (total, item) => total + Number(item.nota_avaliacao || 0),
          0
        );

        setMedia(avaliacoes.length ? soma / avaliacoes.length : 0);

      }

    } catch (error) {

      console.error(
        'Erro ao calcular média:',
        error
      );

    }

  }, [id]);

  useEffect(() => {

    carregarMotorista();

    calcularMedia();

  }, [carregarMotorista, calcularMedia]);

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
        'Selecione uma nota.'
      );

      return;

    }

    try {

      const { data } = await api.post(
        '/avaliacao',
        {

            id_motorista: id,

            nota_avaliacao: nota,

            comentario_avaliacao:
              comentario

        }
      );

      if (data.sucesso) {

        mostrarMensagem(
          'Avaliação enviada com sucesso!'
        );

        setNota(0);

        setComentario('');

        calcularMedia();

      }

    } catch (error) {

      mostrarMensagem(
        error.response?.data?.mensagem ||
        'Não foi possível salvar a avaliação.'
      );

      console.error(
        'Erro ao enviar avaliação:',
        error
      );

    }

  }

  if (carregando) {

    return <p>Carregando...</p>;

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
              Informações do motorista
            </h1>

            <p>
              Visualize os dados e avalie
              o motorista.
            </p>

          </div>

        </div>

        <div className={Styles.profileSection}>

          <div className={Styles.imageBox}>

            {
              motorista?.foto_motorista && (
              <img
                src={getArquivoUrl(motorista?.foto_motorista)}
                alt={motorista?.nome_motorista}
              />
              )
            }

          </div>

          <div className={Styles.infoBox}>

            <h1>
              {
                motorista?.nome_motorista
              }
            </h1>

            <div className={Styles.infoGrid}>
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
                  className={`${Styles.star} ${
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
                `/avaliacao/${id}`
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
