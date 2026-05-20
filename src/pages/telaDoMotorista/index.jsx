import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import styles from './styles.module.css';

import api from '../../services/apis';

export default function TelaDoMotorista() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [motorista, setMotorista] =
        useState(null);

    useEffect(() => {

        async function carregarMotorista() {

            try {

                const response =
                    await api.get(
                        `/motoristas/${id}`
                    );

                setMotorista(
                    response.data.dados
                );

            } catch (error) {

                console.error(
                    'Erro ao carregar motorista:',
                    error
                );

            }

        }

        carregarMotorista();

    }, [id]);

    return (

        <div className={styles.container}>

            <div className={styles.card}>

                <h1>
                    Bem-vindo!
                </h1>

                {motorista ? (

                    <>

                        <h2>
                            {motorista.nome_motorista}
                        </h2>

                        <p>
                            ID do motorista: {id}
                        </p>

                    </>

                ) : (

                    <p>
                        Carregando motorista...
                    </p>

                )}

                <button
                    className={styles.botao}
                    onClick={() =>
                        navigate('/')
                    }
                >
                    Sair
                </button>

            </div>
        </div>
    );
}