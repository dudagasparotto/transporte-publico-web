import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';


export default function RotasLinhas() {

  const [linha, setLinha] = useState('https://www.google.com/maps?q=Tupã,SP&z=13&output=embed');

  const navigate = useNavigate();

  const descricao = [
    {
      nome: 'Rota Roxa',
      Inicio: 'Tal rua (ponto).',
      Fim: 'Tal rua (ponto).',
      descricao: 'Linha que atende a região sul da cidade.',
    },
    {
      nome: 'Rota Azul',
      Inicio: 'Tal rua (ponto).',
      Fim: 'Tal rua (ponto).',
      descricao: 'Atende moradores da região leste.',
    },
    {
      nome: 'Rota Laranja',
      Inicio: 'Tal rua (ponto).',
      Fim: 'Tal rua (ponto).',
      descricao: 'Linha com passagem pela região universitária.',
    },
    {
      nome: 'Rota Amarela',
      Inicio: 'Tal rua (ponto).',
      Fim: 'Tal rua (ponto).',  
      descricao: 'Trecho com maior fluxo de passageiros.',
    },
  ];

  return (
    <div className={styles.container}>

      {/* TOPO */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.motoristaBox}>
            <button className={styles.motoristaTexto} onClick={() => navigate('/infoMotorista')}>
              MOTORISTA
            </button>
          
          </div>
        </div>

        <button className={styles.Button} onClick={() => navigate('/')}>
          HOME
        </button>
      </header>

      <main className={styles.main}>
        {/* MAPA DA CIDADE*/}
        <section className={styles.mapaSection}>
          <div className={styles.mapaWrapper}>
            <iframe
              title="Mapa de Tupã"
              src={linha}
              className={styles.mapa}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* PAINEL LATERAL */}
        <aside className={styles.infoPanel}>
          <h2 className={styles.subtitulo}>Rotas disponíveis</h2>

          <button className={styles.Button} onClick={() => setLinha('https://www.google.com/maps/d/embed?mid=1NrZESVWmv8C0DlpWJpVjhzOJvHxPMDE')}> 
            <div>
              ROTA ROXA
            </div>
          </button>
          <button className={styles.Button} onClick={() => setLinha('')}> {/*POR O RESTO DOS LINKS*/}
            <div> 
              ROTA AZUL
            </div>
          </button>
          <button className={styles.Button} onClick={() => setLinha('')}>
            <div>
              ROTA LARANJA
            </div>
          </button>
          <button className={styles.Button} onClick={() => setLinha('')}>
            <div>
              ROTA AMARELA
            </div>
          </button>

          <h2 className={styles.subtitulo}>Descrição das rotas:</h2>

          <div className={styles.descricaoRotas}>
            {descricao.map((descricao, index) => (
              <div key={index} className={styles.descricaoItens}>
                <h4 className={styles.descricaoItem}>{descricao.nome}</h4>
                <p className={styles.descricaoItem}>Inicio: {descricao.Inicio}</p>
                <p className={styles.descricaoItem}>Fim: {descricao.Fim}</p>
                <p className={styles.descricaoItem}>{descricao.descricao}</p>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
