import React, { useEffect, useState } from 'react';
import './MovimentacaoTela.css';
import axios from "axios";

function MovimentacaoTela() {
    const [item, setItem] = useState({ id_funcionario: 0, id_epi: 0, quantidade: 1 });
    const [funcionario, setFuncionarios] = useState([]);
    const [epi, setEpis] = useState([]);
    const [error, setError] = useState(null);

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
                setError('Erro ao buscar dados');
                console.error('Erro ao buscar dados:', err);
            }
        };

        fetchData();
    }, []);

    const retirarMovimentacao = async () => {
        console.log(item);
        try {
            const res = await axios.post("http://localhost:3001/movimentacao/retirar", item);
            console.log(res.data);
            alert('EPI retirado com sucesso!');
        } catch (err) {
            console.error('Erro ao retirar EPI:', err);
            alert('Erro ao retirar EPI. Tente novamente!');
        }
    }

    const devolverMovimentacao = async () => {
        console.log(item);
        try {
            const res = await axios.post("http://localhost:3001/movimentacao/devolver", item);
            console.log(res.data);
            alert('EPI devolvido com sucesso!');
        } catch (err) {
            console.error('Erro ao devolver EPI:', err);
            alert('Erro ao devolver EPI. Tente novamente!');
        }
    }

    const handleQuantidadeChange = (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setItem({ ...item, quantidade: 1 });
        } else {
            setItem({ ...item, quantidade: value });
        }
    };

    return (
        <div className="movimentacao-container">
            <img src="https://ecommerce.sesisenai.org.br/images/logos/sesi-senai.webp" alt="Logo" className="movimentacao-logo" />
            <h2>Controle de Movimentação</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="movimentacao-box">
                <div className="movimentacao-input-group">
                    <label htmlFor="id_funcionario">Funcionário:</label>
                    <select
                        className="movimentacao-input"
                        id="id_funcionario"
                        onChange={(e) => setItem({ ...item, id_funcionario: parseInt(e.target.value) })}
                    >
                        <option value="">Selecione o Funcionário</option>
                        {funcionario.map((f) => (
                            <option key={f.id} value={f.id}>{f.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="movimentacao-input-group">
                    <label htmlFor="id_epi">EPI:</label>
                    <select
                        className="movimentacao-input"
                        id="id_epi"
                        onChange={(e) => setItem({ ...item, id_epi: parseInt(e.target.value) })}
                    >
                        <option value="">Selecione o EPI</option>
                        {epi.map((e) => (
                            <option key={e.id} value={e.id}>{e.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="movimentacao-input-group">
                    <label htmlFor="quantidade">Quantidade:</label>
                    <input
                        type="number"
                        className="movimentacao-input"
                        id="quantidade"
                        value={item.quantidade}
                        onChange={handleQuantidadeChange}
                        min="1"
                        disabled={!item.id_funcionario || !item.id_epi}
                    />
                </div>

                <div className="movimentacao-buttons">
                    <button className="movimentacao-button" onClick={retirarMovimentacao}>Retirar EPI</button>
                    <button className="movimentacao-button" onClick={devolverMovimentacao}>Devolver EPI</button>
                </div>
            </div>
        </div>
    );
}

export default MovimentacaoTela;
