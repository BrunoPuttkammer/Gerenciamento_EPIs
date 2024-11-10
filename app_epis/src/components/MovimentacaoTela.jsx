import React, { useEffect, useState } from 'react';
import './MovimentacaoTela.css';
import axios from "axios";

function MovimentacaoTela() {
    const [item, setItem] = useState({ id_funcionario: 0, id_epi: 0 });
    const [funcionario, setFuncionarios] = useState([]);
    const [epi, setEpis] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [funcionariosResponse, episResponse] = await Promise.all([
                    axios.get('http://localhost:3001/funcionario'),
                    axios.get('http://localhost:3001/epi'),
                ]);

                setFuncionarios(funcionariosResponse.data);
                setEpis(episResponse.data);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
            }
        };

        fetchData();
    }, []);


    const retirarMovimentacao = async () => {
        console.log(item);
        const res = await axios.post("http://localhost:3001/movimentacao/retirar", item);
    }

    const devolverMovimentacao = async () => {
        console.log(item);
        const res = await axios.post("http://localhost:3001/movimentacao/devolver", item);
    }

    return (
        <body className="movimentacao-body">
            <div className="movimentacao-container">
                <img src="https://ecommerce.sesisenai.org.br/images/logos/sesi-senai.webp" alt="Logo" className="movimentacao-logo" />
                <h2>Controle de Movimentação</h2>
                <div className="movimentacao-box">
                    <div className="movimentacao-input-group">
                        <label htmlFor="id_funcionario">Funcionário:</label>
                        <input
                            type="number"
                            className="movimentacao-input"
                            id="id_funcionario"
                            placeholder="Nome do funcionário"
                            onChange={(e) => setItem({ ...item, id_funcionario: e.target.value })}
                        />
                    </div>
                    <div className="movimentacao-input-group">
                        <label htmlFor="id_epi">EPI:</label>
                        <input
                            type="number"
                            className="movimentacao-input"
                            id="id_epi"
                            placeholder="Nome do EPI"
                            onChange={(e) => setItem({ ...item, id_epi: e.target.value })}
                        />
                    </div>
                    <div className="movimentacao-buttons">
                        <button className="movimentacao-button" onClick={retirarMovimentacao}>Retirar EPI</button>
                        <button className="movimentacao-button" onClick={devolverMovimentacao}>Devolver EPI</button>
                    </div>
                </div>
            </div>
        </body>
    );
}

export default MovimentacaoTela;
