import { useEffect, useState } from 'react';
import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom';
import { getCollection } from '../../mockup/localStorage';

export default function Horarios() {
  const [linhas, setLinhas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = getCollection('horarios');
    setLinhas(dados.length > 0 ? dados : [
      {
        id: 1,
        linha: "Linha Roxa",
        pontos: [
          {
            nome: "Rodoviária",
            horarios: ["08:00", "09:00", "10:00", "11:00", "12:00"]
          },
          {
            nome: "Mercado Central",
            horarios: ["08:10", "09:10", "10:10", "11:10"]
          }
        ]
      },
      { id: 2,
        linha: "Linha Azul",
        pontos: [
          {
            nome: "Escola",
            horarios: ["08:20", "09:20", "10:20"]
          }
        ]
      },
      { id: 3,
        linha: "Linha Laranja",
        pontos: [
          {
            nome: "Terminal",
            horarios: ["07:00", "08:00", "09:00"]
          }
        ]
      },
      { id: 4,
        linha: "Linha Amarela",
        pontos: [
          {
            nome: "Centro",
            horarios: ["06:30", "07:30", "08:30"]
          }
        ]
      }
    ]);
  }, []);

  return (
    <div className={styles.fundo}> 

    <div className={styles.overlay} />

      <div className={styles.header}>
        <h1 className={styles.titulinho}>Horários</h1>
        <button className={styles.button} onClick={() => navigate('/')}>
                  HOME
                </button> 
      </div>

      <div className={styles.container}>

        {linhas.map((linha) => (
          <div key={linha.id} className={styles.linha}>

            <h2 className={styles.tituloLinha}>
              {linha.linha}
            </h2>

            {linha.pontos.map((ponto, index) => (
              <div key={index} className={styles.card}>

                <div className={styles.topo}>
                  <span className={styles.nome}>{ponto.nome}</span>

                </div>

                <div className={styles.horarios}>
                  {ponto.horarios.map((hora, i) => ( //Para cada horário que existe, cria um elemento na tela
                    <span key={i} className={styles.hora}>
                      {hora} 
                    </span>
                  ))}
                </div>

              </div>
            ))}

          </div>
        ))}

      </div>

    </div>
  )
}