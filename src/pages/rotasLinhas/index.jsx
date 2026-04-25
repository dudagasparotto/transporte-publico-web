import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCollection } from '../../mockup/localStorage';

import styles from './styles.module.css';

export default function RotasLinhas() {
  const [rotas, setRotas] = useState([]);
  const [linha, setLinha] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const dados = getCollection('rotas');
    const inicial = dados.length > 0 ? dados : [
      {
        id: 1,
        nome: 'Rota Roxa',
        saida: 'Terminal Central',
        destino: 'Bairro Roxo',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F&noprof=1',
      },
      {
        id: 2,
        nome: 'Rota Azul',
        saida: 'Terminal Norte',
        destino: 'Bairro Azul',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F&noprof=1',
      },
      {
        id: 3,
        nome: 'Rota Laranja',
        saida: 'Terminal Sul',
        destino: 'Bairro Laranja',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F&noprof=1',
      },
      {
        id: 4,
        nome: 'Rota Amarela',
        saida: 'Rodoviária',
        destino: 'Bairro Amarelo',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F&noprof=1',
      },
    ];
    setRotas(inicial);
    setLinha(inicial[0].mapa);
  }, []);

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

          {rotas.map((rotaItem, index) => (
            <button
              key={rotaItem.id}
              className={styles.Button}
              onClick={() => setLinha(rotaItem.mapa)}
            >
              <div>{rotaItem.nome.toUpperCase()}</div>
            </button>
          ))}

          <h2 className={styles.subtitulo}>Descrição das rotas:</h2>

          <div className={styles.descricaoRotas}>
            {rotas.map((rotaItem) => (
              <div key={rotaItem.id} className={styles.descricaoItens}>
                <h4 className={styles.descricaoItem}>{rotaItem.nome}</h4>
                <p className={styles.descricaoItem}>Início: {rotaItem.saida}</p>
                <p className={styles.descricaoItem}>Fim: {rotaItem.destino}</p>
                <p className={styles.descricaoItem}>Paradas: {rotaItem.paradas?.join(', ')}</p>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
