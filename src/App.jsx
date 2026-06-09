import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import InfoMotorista from './pages/infoMotorista/index';
import AvaliacaoMotorista from './pages/avaliacaoMotorista/index';
import CadastroMotorista from './pages/cadMotorista/index';
import EditarPontos from './pages/editarPontos';
import EditarRota from './pages/editarRota';
import Home from './pages/home';
import LoginAdm from './pages/loginAdm';
import HomeAdm from './pages/homeAdm';
import CadastroPontos from './pages/cadPontos';
import RotasLinhas from './pages/rotasLinhas';
import Horarios from './pages/horarios';
import Negado from './pages/loginAdm/negado';
import EditarHorarios from './pages/editarHoraios';
import LoginMotora from './pages/loginMotorista';
import TelaDoMotorista from './pages/telaDoMotorista';
import MotoristasAdm from './pages/motoristasAdm';
import { obterSessao } from './services/auth';

function RedirecionarMotoristaAutenticado() {
  const sessao = obterSessao();

  return <Navigate to={`/teladomotorista/${sessao.idMotorista}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/avaliacao/:id" element={<AvaliacaoMotorista />} />
      <Route path="/infoMotorista/:id" element={<InfoMotorista />} />
      <Route path="/avaliacaoMotorista" element={<AvaliacaoMotorista />} />
      <Route path="/cadpontos" element={<CadastroPontos />} />
      <Route path="/rotas" element={<RotasLinhas />} />
      <Route path="/horarios" element={<Horarios />} />
      <Route path="/loginadm" element={<LoginAdm />} />
      <Route path="/loginmotorista" element={<LoginMotora />} />
      <Route path="/login/negado" element={<Negado />} />

      <Route
        element={
          <ProtectedRoute tipoUsuario={1} redirecionarPara="/loginadm" />
        }
      >
        <Route path="/adm" element={<HomeAdm />} />
        <Route path="/adm/cadmotora" element={<CadastroMotorista />} />
        <Route path="/adm/motoristas" element={<MotoristasAdm />} />
        <Route path="/adm/motoristas/:id/editar" element={<CadastroMotorista />} />
        <Route path="/adm/editarpontos" element={<EditarPontos />} />
        <Route path="/adm/editarrota" element={<EditarRota />} />
        <Route path="/adm/cadpontos" element={<CadastroPontos />} />
        <Route path="/adm/editarhorarios" element={<EditarHorarios />} />
      </Route>

      <Route
        path="/teladomotorista"
        element={
          <ProtectedRoute tipoUsuario={2} redirecionarPara="/loginmotorista">
            <RedirecionarMotoristaAutenticado />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teladomotorista/:id"
        element={
          <ProtectedRoute
            tipoUsuario={2}
            redirecionarPara="/loginmotorista"
            restringirAoMotorista
          >
            <TelaDoMotorista />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
