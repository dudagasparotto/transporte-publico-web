import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';


export default function RotasLinhas() {

  const [linha, setLinha] = useState('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24896.948428396703!2d-50.52369407013919!3d-21.93633798754604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495b803789ea39f%3A0xe5a9d8bbc523cfc!2zVHVww6MsIFNQ!5e0!3m2!1spt-BR!2sbr!4v1776986140267!5m2!1spt-BR!2sbr');

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

          <button className={styles.Button} onClick={() => setLinha('https://www.google.com/maps/d/u/1/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F&noprof=1')}> 
            <div>
              ROTA ROXA
            </div>
          </button>
          <button className={styles.Button} onClick={() => setLinha('https://www.google.com/maps/d/u/1/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F&noprof=1')}> {/*POR O RESTO DOS LINKS*/}
            <div> 
              ROTA AZUL
            </div>
          </button>
          <button className={styles.Button} onClick={() => setLinha('https://www.google.com/maps/d/u/1/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F&noprof=1')}>
            <div>
              ROTA LARANJA
            </div>
          </button>
          <button className={styles.Button} onClick={() => setLinha('https://www.google.com/maps/d/u/1/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F&noprof=1')}>
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
