import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

import {
  EVENTO_SESSAO,
  validarSessao,
} from '../../services/auth';

export default function ProtectedRoute({
  tipoUsuario,
  redirecionarPara,
  restringirAoMotorista = false,
  children,
}) {
  const location = useLocation();
  const { id } = useParams();
  const [estado, setEstado] = useState({
    chave: '',
    status: 'validando',
    sessao: null,
  });
  const [versaoValidacao, setVersaoValidacao] = useState(0);
  const chaveValidacao = [
    location.pathname,
    location.search,
    tipoUsuario,
    versaoValidacao,
  ].join('|');

  useEffect(() => {
    function solicitarNovaValidacao() {
      setVersaoValidacao((versaoAtual) => versaoAtual + 1);
    }

    window.addEventListener(EVENTO_SESSAO, solicitarNovaValidacao);
    window.addEventListener('storage', solicitarNovaValidacao);

    return () => {
      window.removeEventListener(EVENTO_SESSAO, solicitarNovaValidacao);
      window.removeEventListener('storage', solicitarNovaValidacao);
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    validarSessao(tipoUsuario).then((resultado) => {
      if (!ativo) return;

      if (resultado.valida) {
        setEstado({
          chave: chaveValidacao,
          status: 'autorizado',
          sessao: resultado.sessao,
        });
        return;
      }

      setEstado({
        chave: chaveValidacao,
        status:
          resultado.motivo === 'acesso-negado'
            ? 'acesso-negado'
            : 'nao-autenticado',
        sessao: null,
      });
    });

    return () => {
      ativo = false;
    };
  }, [chaveValidacao, tipoUsuario]);

  const statusAtual =
    estado.chave === chaveValidacao ? estado.status : 'validando';

  if (statusAtual === 'validando') {
    return (
      <div
        role="status"
        style={{
          minHeight: '100vh',
          width: '100%',
          minWidth: 0,
          alignSelf: 'stretch',
          display: 'grid',
          placeItems: 'center',
          background: '#0f172a',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 700,
        }}
      >
        Validando acesso...
      </div>
    );
  }

  if (statusAtual === 'acesso-negado') {
    return (
      <Navigate
        to="/login/negado"
        replace
        state={{ redirecionarPara }}
      />
    );
  }

  if (statusAtual === 'nao-autenticado') {
    return (
      <Navigate
        to={redirecionarPara}
        replace
        state={{ from: location }}
      />
    );
  }

  const sessao = estado.sessao;
  const motoristaCorreto =
    !restringirAoMotorista ||
    Number(sessao?.idMotorista) === Number(id);

  if (!motoristaCorreto) {
    return (
      <Navigate
        to="/login/negado"
        replace
        state={{ redirecionarPara }}
      />
    );
  }

  return children ?? <Outlet />;
}
