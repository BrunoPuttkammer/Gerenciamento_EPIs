import React, { useEffect, useState } from 'react';
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
        <div>
            <h2>Histórico</h2>
            <ul>
                {historico.map(item => (
                    <li key={item.id}>
                        {item.funcionario_nome} - {item.epi_nome} - {item.data} - {item.acao}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HistoricoTela;
