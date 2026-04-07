import styles from './styles.module.css';

import { useNavigate } from 'react-router-dom';

export default function RotasLinhas() {
  const navigate = useNavigate();

  const pontos = [
    {
      nome: 'Terminal Central',
      descricao: 'Ponto principal de saída e chegada dos ônibus.',
    },
    {
      nome: 'Vila Marajoara',
      descricao: 'Atende moradores da região oeste.',
    },
    {
      nome: 'UNESP / Região Norte',
      descricao: 'Linha com passagem pela região universitária.',
    },
    {
      nome: 'Centro',
      descricao: 'Trecho com maior fluxo de passageiros.',
    },
  ];

  return (
    <div className={styles.container}>

      {/* TOPO */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.motoristaBox}>
            <span className={styles.motoristaTexto}>MOTORISTA</span>
            <div className={styles.iconBox}>🚌</div>
          </div>
        </div>

        <button className={styles.homeButton} onClick={() => navigate('/')}>
          HOME
        </button>
      </header>

      <main className={styles.main}>
        {/* MAPA DA CIDADE*/}
        <section className={styles.mapaSection}>
          <div className={styles.mapaWrapper}>
            <iframe
              title="Mapa de Tupã"
              src="https://www.google.com/maps?q=Tupã,SP&z=13&output=embed"
              className={styles.mapa}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* PAINEL LATERAL */}
        <aside className={styles.infoPanel}>
          <h2 className={styles.subtitulo}>Linhas disponíveis</h2>

          <button className={styles.homeButton} onClick={() => navigate('')}> {/*AQUI O MAPA TA DENTRO DO BOTAO QUE ACESSA A HOME, ARRUMAR ISSO!*/}
            <div>
                <iframe
                title="RORA ROXA"
                src="https://www.google.com/maps/d/embed?mid=1NrZESVWmv8C0DlpWJpVjhzOJvHxPMDE"
                className={styles.mapa}
                loading="lazy"
                allowFullScreen
                ></iframe>
            </div>
          </button>

          <div className={styles.linhaCard}>
            <h3>Linha AZUL - Centro / UNESP</h3>
          </div>

          <div className={styles.linhaCard}>
            <h3>Linha AMARELA - Centro / Industrial</h3>
          </div>

          <h2 className={styles.subtitulo}>Pontos principais</h2>

          <div className={styles.listaPontos}>
            {pontos.map((ponto, index) => (
              <div key={index} className={styles.pontoItem}>
                <h4>{ponto.nome}</h4>
                <p>{ponto.descricao}</p>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
