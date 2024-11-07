import React, { useEffect, useState } from 'react';
import './MovimentacaoTela.css';
import axios from "axios"

function MovimentacaoTela() {

    const [item, setItem] = useState({ id_funcionario: 0, id_epi: 0 })
    const [funcionario, setFuncionarios] = useState([])
    const [epi, setEpis] = useState([])

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
        console.log(item)
        const res = await axios.post("http://localhost:3001/movimentacao/retirar", item)
    }


    return (
        <div className="container">
            <div className="header">
                Controle de Movimentação
            </div>
            <div className="box">
                <div className="input-group">
                    <label>Funcionário:</label>
                    <input type="number" className="input" placeholder="Nome do funcionário" onChange={(e) => item.id_funcionario = e.target.value} />
                </div>
                <div className="input-group">
                    <label>EPI:</label>
                    <input type="number" className="input" placeholder="Nome do EPI" onChange={(e) => item.id_epi = e.target.value} />
                </div>
                <div className="buttons">
                    <button className="mov_button" onClick={() => retirarMovimentacao()}>Retirar EPI</button>
                    <button className="mov_button"onClick={() => devolverMovimentacao()}>Devolver EPI</button>
                </div>
            </div>
        </div>
    );

}
export default MovimentacaoTela;
