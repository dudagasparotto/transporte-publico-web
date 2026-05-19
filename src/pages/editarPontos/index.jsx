import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.css";

export default function EditarPontos() {

  const navigate = useNavigate();

  const rotas = [

    {
      nome: "ROXA",
      cor: "#7C3AED",

      mapa:
        "https://www.google.com/maps/d/embed?mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ehbc=2E312F",

      editar:
        "https://www.google.com/maps/d/edit?hl=pt-BR&mid=1EifQjeD8Cx_JHRKUjpf0wx2JezX3bxw&ll=-21.92382017330368%2C-50.50826300000001&z=14",
    },

    {
      nome: "AZUL",
      cor: "#2563EB",

      mapa:
        "https://www.google.com/maps/d/embed?mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ehbc=2E312F",

      editar:
        "https://www.google.com/maps/d/edit?hl=pt-BR&mid=1PZnUg7Xd-2Y_LuZgKu0I8XBxSUJqOGg&ll=-21.933259358327934%2C-50.50249973895575&z=15",
    },

    {
      nome: "LARANJA",
      cor: "#EA580C",

      mapa:
        "https://www.google.com/maps/d/embed?mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ehbc=2E312F",

      editar:
        "https://www.google.com/maps/d/edit?hl=pt-BR&mid=1bUGpvBgmP-nTU3OPTjyh48C8-2XWEt4&ll=-21.931932733565503%2C-50.504239999999996&z=15",
    },

    {
      nome: "AMARELA",
      cor: "#EAB308",

      mapa:
        "https://www.google.com/maps/d/embed?mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ehbc=2E312F",

      editar:
        "https://www.google.com/maps/d/edit?hl=pt-BR&mid=1oHTQrYTHxzncd8IdKuHOWY9z0damzVE&ll=-21.938244634367194%2C-50.50728750000001&z=15",
    },

  ];

  const [rotaSelecionada, setRotaSelecionada] =
    useState(rotas[0]);

  return (

    <div className={styles.container}>

      <div className={styles.overlay}></div>

      <header className={styles.header}>

        <h1 className={styles.titulo}>
          PAINEL ADMINISTRATIVO - EDITAR PONTOS
        </h1>

        <button
          className={styles.botaoVoltar}
          onClick={() => navigate("/adm")}
        >
          VOLTAR
        </button>

      </header>

      <main className={styles.card}>

        <div className={styles.topo}>

          <div>

            <h2 className={styles.subtitulo}>
              Editar Rotas e Pontos
            </h2>

            <p className={styles.descricao}>
              Selecione uma rota para editar os
              pontos diretamente no Google Maps.
            </p>

          </div>

        </div>

        <div className={styles.botoesRotas}>

          {rotas.map((rota) => (

            <button
              key={rota.nome}
              className={`${styles.botaoRota} ${
                rotaSelecionada.nome === rota.nome
                  ? styles.ativo
                  : ""
              }`}
              style={{
                background:
                  rotaSelecionada.nome === rota.nome
                    ? rota.cor
                    : "#6B7280",
              }}
              onClick={() =>
                setRotaSelecionada(rota)
              }
            >
              {rota.nome}
            </button>

          ))}

        </div>

        <div className={styles.areaMapa}>

          <iframe
            src={rotaSelecionada.mapa}
            title={rotaSelecionada.nome}
            className={styles.iframe}
            loading="lazy"
            allowFullScreen
          ></iframe>

        </div>

        <div className={styles.rodape}>

          <button
            className={styles.botaoCadPontos}
            onClick={() => navigate("/cadPontos")}
          >
            CADASTRAR PONTO
          </button>

          <a
            href={rotaSelecionada.editar}
            target="_blank"
            rel="noreferrer"
            className={styles.botaoEditar}
          >
            EDITAR MAPA DA ROTA
          </a>

        </div>

      </main>

    </div>

  );

}