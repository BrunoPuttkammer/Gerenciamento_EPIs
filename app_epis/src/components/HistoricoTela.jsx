import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoricoTela.css';

const HistoricoTela = () => {
    const [historico, setHistorico] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [epis, setEpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historicoResponse, funcionariosResponse, episResponse] = await Promise.all([
                    axios.get('http://localhost:3001/movimentacao'),
                    axios.get('http://localhost:3001/funcionario'),
                    axios.get('http://localhost:3001/epi'),
                ]);
    
                setHistorico(historicoResponse.data);
                setFuncionarios(funcionariosResponse.data);
                setEpis(episResponse.data);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    if (loading) return <h2>Carregando...</h2>;
    if (error) return <h2>Erro: {error.message}</h2>;

    return (
        <div className="historico-container">
            <img src="https://ecommerce.sesisenai.org.br/images/logos/sesi-senai.webp" alt="Logo" className="historico-logo" />
            <h2>Histórico</h2>

            <div className="historico-header">
                <span>Funcionário</span>
                <span>EPI</span>
                <span>Data</span>
                <span>Ação</span>
            </div>
            
            <ul className="historico-lista">
                {historico.map(item => (
                    <li key={item.id} className="historico-item">
                        <span>{item.funcionario_nome}</span>
                        <span>{item.epi_nome}</span>
                        <span>{item.data}</span>
                        <span>{item.acao}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HistoricoTela;
