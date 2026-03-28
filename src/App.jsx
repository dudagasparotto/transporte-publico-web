import { Routes, Route } from 'react-router-dom';

//import Home from './pages/home';

import AvaliacaoMotorista from '.src/pages/avaliacaoMotorista';
import CadastroMotorista from './pages/cadMotorista/index';
import EditarPontos from './pages/editarPontos';
import EditarRota from './pages/exemplos/ex-05';
import Home from './pages/';
import HomeAdm from './pages/exemplos/ex-07';
import pontos from './pages/exemplos/ex-08';
import rotasLinhas from './pages/exemplos/ex-09';



function App() {

  return (
  <Routes>
    <Route path="/" element={<Home />} />

    {/*<Route path="/exemplo/1" element={<Exemplo01 />} />
    <Route path="/exemplo/2" element={<Exemplo02 />} />
    <Route path="/exemplo/3" element={<Exemplo03 />} />
    <Route path="/exemplo/4" element={<Exemplo04 />} />    
    <Route path="/exemplo/5" element={<Exemplo05 />} />
    <Route path="/exemplo/6" element={<Exemplo06 />} />
    <Route path="/exemplo/7" element={<Exemplo07 />} />
    <Route path="/exemplo/8" element={<Exemplo08 />} />
    <Route path="/exemplo/9" element={<Exemplo09 />} />
    <Route path="/exemplo/10" element={<Exemplo10 />} />
    <Route path="/exemplo/11" element={<Exemplo11 />} />
    <Route path="/exemplo/12" element={<Exemplo12 />} />


    <Route path="/atividade/1" element={<Atividade01 />} />
    <Route path="/atividade/2" element={<Atividade02 />} />
    <Route path="/atividade/3" element={<Atividade03 />} />
    <Route path="/atividade/4" element={<Atividade04 />} />
    <Route path="/atividade/5" element={<Atividade05 />} />
    <Route path="/atividade/6" element={<Atividade06 />} />*/}
    
  </Routes>
  )
}

export default App
