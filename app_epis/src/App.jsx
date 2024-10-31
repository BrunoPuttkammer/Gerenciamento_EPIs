import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import MovimentacaoPage from './components/MovimentacaoPage';
import CadastrarFuncionarioPage from './components/CadastrarFuncionarioPage';
import CadastrarEpiPage from './components/CadastrarEpiPage';
import HistoricoPage from './components/HistoricoPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movimentacao" element={<MovimentacaoPage />} />
                <Route path="/cadastrar-funcionario" element={<CadastrarFuncionarioPage />} />
                <Route path="/cadastrar-epi" element={<CadastrarEpiPage />} />
                <Route path="/historico" element={<HistoricoPage />} />
            </Routes>
        </Router>
    );
}

export default App;
