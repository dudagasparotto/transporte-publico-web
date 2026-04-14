import {BrowserRouter, Routes, Route } from 'react-router-dom';

//import Home from './pages/home';


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



function App() {

  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/avaliacao" element={<AvaliacaoMotorista />} />
      <Route path="/infomotorista" element={<InfoMotorista />} />
      <Route path="/avaliacaoMotorista" element={<AvaliacaoMotorista />} />
      <Route path="/adm/cadmotora" element={<CadastroMotorista />} />
      <Route path="/adm/editarpontos" element={<EditarPontos />} />
      <Route path="/adm/editarrota" element={<EditarRota />} />
      <Route path="/adm" element={<HomeAdm />} />
      <Route path="/cadpontos" element={<CadastroPontos />} />
      <Route path="/rotas" element={<RotasLinhas />} />
      <Route path="/horarios" element={<Horarios />} />
      <Route path="/login" element={<LoginAdm />} />
      <Route path="/login/negado" element={<Negado />} />
      <Route path="/adm/editarhorarios" element={<EditarHorarios />} />
    </Routes>

  )
}

export default App
