import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

import { obterSessao } from '../../services/auth';

export default function ProtectedRoute({
  tipoUsuario,
  redirecionarPara,
  restringirAoMotorista = false,
  children,
}) {
  const location = useLocation();
  const { id } = useParams();
  const sessao = obterSessao();
  const tipoCorreto = sessao?.tipoUsuario === Number(tipoUsuario);
  const motoristaCorreto =
    !restringirAoMotorista ||
    Number(sessao?.idMotorista) === Number(id);

  if (!tipoCorreto || !motoristaCorreto) {
    return (
      <Navigate
        to={redirecionarPara}
        replace
        state={{ from: location }}
      />
    );
  }

  return children ?? <Outlet />;
}
