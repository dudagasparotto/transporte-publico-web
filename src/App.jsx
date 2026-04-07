import {BrowserRouter, Routes, Route } from 'react-router-dom';

//import Home from './pages/home';

import AvaliacaoMotorista from './pages/avaliacaoMotorista';
import CadastroMotorista from './pages/cadMotorista/index';
import EditarPontos from './pages/editarPontos';
import EditarRota from './pages/editarRota';
import Home from './pages/home';
import LoginAdm from './pages/loginAdm';
import HomeAdm from './pages/homeAdm';
import CadastroPontos from './pages/pontos';
import RotasLinhas from './pages/rotasLinhas';
import Horarios from './pages/horarios';
import Negado from './pages/loginAdm/negado';
import Mapas from './pages/mapas/index';



function App() {

  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/avaliacao" element={<AvaliacaoMotorista />} />
      <Route path="/cadmotora" element={<CadastroMotorista />} />
      <Route path="/editarpontos" element={<EditarPontos />} />
      <Route path="/editarrota" element={<EditarRota />} />
      <Route path="/adm" element={<HomeAdm />} />
      <Route path="/cadpontos" element={<CadastroPontos />} />
      <Route path="/rotas" element={<RotasLinhas />} />
      <Route path="/mapas" element={<Mapas />} />
      <Route path="/horarios" element={<Horarios />} />
      <Route path="/login" element={<LoginAdm />} />
      <Route path="/login/negado" element={<Negado />} />
    </Routes>

  )
}

export default App
