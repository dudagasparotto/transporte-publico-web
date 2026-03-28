import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';

import Exemplo01 from './pages/exemplos/ex-01';
import Exemplo02 from './pages/exemplos/ex-02';
import Exemplo03 from './pages/exemplos/ex-03';
import Exemplo04 from './pages/exemplos/ex-04';
import Exemplo05 from './pages/exemplos/ex-05';
import Exemplo06 from './pages/exemplos/ex-06';
import Exemplo07 from './pages/exemplos/ex-07';
import Exemplo08 from './pages/exemplos/ex-08';
import Exemplo09 from './pages/exemplos/ex-09';
import Exemplo10 from './pages/exemplos/ex-10';
import Exemplo11 from './pages/exemplos/ex-11';
import Exemplo12 from './pages/exemplos/ex-12';

import Atividade01 from './pages/atividades/atv-01';
import Atividade02 from './pages/atividades/atv-02';
import Atividade03 from './pages/atividades/atv-03';
import Atividade04 from './pages/atividades/atv-04';
import Atividade05 from './pages/atividades/atv-05';
import Atividade06 from './pages/atividades/atv-06';

function App() {

  return (
  <Routes>
    <Route path="/" element={<Home />} />

    <Route path="/exemplo/1" element={<Exemplo01 />} />
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
    <Route path="/atividade/6" element={<Atividade06 />} />
  </Routes>
  )
}

export default App
