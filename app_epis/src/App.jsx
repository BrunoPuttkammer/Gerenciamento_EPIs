import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeTela from './components/HomeTela';
import MovimentacaoTela from './components/MovimentacaoTela';
import CadastrarFuncionarioTela from './components/CadastrarFuncionarioTela';
import CadastrarEpiTela from './components/CadastrarEpiTela';
import HistoricoTela from './components/HistoricoTela';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeTela />} />
                <Route path="/movimentacao" element={<MovimentacaoTela />} />
                <Route path="/cadastrar-funcionario" element={<CadastrarFuncionarioTela />} />
                <Route path="/cadastrar-epi" element={<CadastrarEpiTela />} />
                <Route path="/historico" element={<HistoricoTela />} />
            </Routes>
        </Router>
    );
}

export default App;
