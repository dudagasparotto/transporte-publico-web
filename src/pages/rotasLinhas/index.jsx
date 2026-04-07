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
      <h1>Rotas e Linhas</h1>
      <p>Conteúdo relacionado a rotas e linhas de transporte público.</p>
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

      {/* CONTEÚDO */}
      <main className={styles.main}>
        {/* MAPA */}
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

          <div className={styles.linhaCard}>
            <h3>Linha 01 - Centro / Vila</h3>
            <p>Passa pela região central e bairros residenciais.</p>
          </div>

          <div className={styles.linhaCard}>
            <h3>Linha 02 - Centro / UNESP</h3>
            <p>Atende estudantes e moradores da zona norte.</p>
          </div>

          <div className={styles.linhaCard}>
            <h3>Linha 03 - Centro / Industrial</h3>
            <p>Rota voltada para trabalhadores e comércio local.</p>
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
