import styles from './styles.module.css'

const linhas = [
  {
    id: 1,
    nome: "Linha Roxa",
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
    nome: "Linha Azul",
    pontos: [
      {
        nome: "Escola",
        horarios: ["08:20", "09:20", "10:20"]
      }
    ]
  },

  { id: 3,
    nome: "Linha Laranja",
    pontos: [
      {
        nome: "Terminal",
        horarios: ["07:00", "08:00", "09:00"]
      }
    ]
  },

  { id: 4,
    nome: "Linha Amarela",
    pontos: [
      {
        nome: "Centro",
        horarios: ["06:30", "07:30", "08:30"]
      }
    ]
  }
]

export default function Horarios() {
  return (
    <div className={styles.fundo}>

      <div className={styles.header}>
        <h1>Horários de Ônibus</h1>
        <button className={styles.button} onClick={() => navigate('/')}>
                  HOME
                </button>
      </div>

      <div className={styles.container}>

        {linhas.map((linha) => (
          <div key={linha.id} className={styles.linha}>

            <h2 className={styles.tituloLinha}>
              {linha.nome}
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