import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCollection } from '../../mockup/localStorage';
import motoristaImg from '../../assets/motorista.webp';

import styles from './styles.module.css';

export default function RotasLinhas() {
  const [rotas, setRotas] = useState([]);
  const [linha, setLinha] = useState('');
  const navigate = useNavigate();

  const motoristas = [
    { nome: 'João Paulo Silva', nota: 4.8, status: 'Em serviço' },
    { nome: 'Maria Oliveira', nota: 4.6, status: 'Em serviço' },
    { nome: 'Carlos Mendes', nota: 4.7, status: 'Em serviço' },
  ];

  useEffect(() => {
    const dados = getCollection('rotas');
    const inicial = dados.length > 0 ? dados : [
      {
        id: 1,
        nome: 'Rota Roxa',
        saida: 'Terminal Central',
        destino: 'Bairro Roxo',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F&noprof=1',
        paradas: ['Terminal Central', 'Av. Principal', 'Mercado Central', 'Bairro Roxo'],
      },
      {
        id: 2,
        nome: 'Rota Azul',
        saida: 'Terminal Norte',
        destino: 'Bairro Azul',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F&noprof=1',
        paradas: ['Terminal Norte', 'Praça Azul', 'Hospital Municipal', 'Bairro Azul'],
      },
      {
        id: 3,
        nome: 'Rota Laranja',
        saida: 'Terminal Sul',
        destino: 'Bairro Laranja',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F&noprof=1',
        paradas: ['Terminal Sul', 'Av. das Flores', 'Shopping Sul', 'Bairro Laranja'],
      },
      {
        id: 4,
        nome: 'Rota Amarela',
        saida: 'Rodoviária',
        destino: 'Bairro Amarelo',
        mapa: 'https://www.google.com/maps/d/u/1/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F&noprof=1',
        paradas: ['Rodoviária', 'Centro', 'Escola Municipal', 'Bairro Amarelo'],
      },
    ];

    setRotas(inicial);
    setLinha(inicial[0]?.mapa || '');
  }, []);

  return (
    <div className={styles.container}>
      {/* TOPO */}
      <header className={styles.header}>
        <button className={styles.Button} onClick={() => navigate('/')}>
          HOME
        </button>
      </header>

      <main className={styles.main}>
        {/* MAPA DA CIDADE */}
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

          {rotas.map((rotaItem) => (
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

          {/* ESCOLHER MOTORISTA */}
          <div className={styles.card}>
            <h3>Escolha o motorista para fazer uma avaliação:</h3>

            {motoristas.map((m, i) => (
              <div
                key={i}
                className={styles.driverItem}
                onClick={() => navigate('/infoMotorista', { state: m })}
              >
                <div className={styles.fotoMotorista}>
                  <img src={motoristaImg} alt="Motorista" />
                </div>

                <strong className={styles.driverName}>{m.nome}</strong>
                <span className={styles.status}>{m.status}</span>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
