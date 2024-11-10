import React, { useState, useEffect } from 'react';
import './CadastrarEpiTela.css';
import axios from 'axios';

const CadastrarEpiTela = () => {
    const [epis, setEpis] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        quantidade: 1
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchEpis = async () => {
            try {
                const response = await axios.get('http://localhost:3001/epi');
                setEpis(response.data);
            } catch (error) {
                console.error("Erro ao carregar EPIs:", error);
            }
        };

        fetchEpis();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (formData.nome && formData.descricao) {
            try {
                const response = await axios.post('http://localhost:3001/epi', formData);
                setEpis((prevEpis) => [...prevEpis, { ...formData, id: response.data.epi[0].id }]);
                setFormData({ nome: '', descricao: '', quantidade: 1 });
            } catch (error) {
                console.error("Erro ao salvar EPI:", error);
            }
        } else {
            alert("Por favor, preencha todos os campos!");
        }
    };

    const handleUpdate = async () => {
        if (editingId && formData.nome && formData.descricao) {
            try {
                const response = await axios.put(`http://localhost:3001/epi/${editingId}`, formData);
                setEpis((prevEpis) =>
                    prevEpis.map((epi) => epi.id === editingId ? response.data : epi)
                );
                setFormData({ nome: '', descricao: '', quantidade: 1 });
                setEditingId(null);
            } catch (error) {
                console.error("Erro ao atualizar EPI:", error);
            }
        } else {
            alert("Por favor, preencha todos os campos!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/epi/${id}`);
            setEpis((prevEpis) => prevEpis.filter((epi) => epi.id !== id));
        } catch (error) {
            console.error("Erro ao deletar EPI:", error);
        }
    };

    const handleEditClick = (epi) => {
        setFormData({ nome: epi.nome, descricao: epi.descricao, quantidade: 1 });
        setEditingId(epi.id);
    };

    const handleCancelEdit = () => {
        setFormData({ nome: '', descricao: '', quantidade: 1 });
        setEditingId(null);
    };

    return (
        <div className="cadastrar-epi-form-container">
            <img src="https://ecommerce.sesisenai.org.br/images/logos/sesi-senai.webp" alt="Logo" className="cadastrar-epi-logo" />
            <h2 className="cadastrar-epi-titulo">Cadastrar EPI</h2>
            <div className="cadastrar-epi-input-group">
                <label>Nome:</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder='Digite aqui...'
                />
            </div>
            <div className="cadastrar-epi-input-group">
                <label>Descrição:</label>
                <input
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder='Digite aqui...'
                />
            </div>
            <div className="cadastrar-epi-input-group">
                <label>Quantidade:</label>
                <input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleInputChange}
                    placeholder='Digite aqui...'
                />
            </div>
            <div className="cadastrar-epi-button-group">
                {editingId ? (
                    <>
                        <button onClick={handleUpdate} className="cadastrar-epi-button-update">Atualizar</button>
                        <button onClick={handleCancelEdit} className="cadastrar-epi-button-cancel">Cancelar</button>
                    </>
                ) : (
                    <button onClick={handleSave} className="cadastrar-epi-button-save">Salvar</button>
                )}
            </div>
            <table className="cadastrar-epi-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {epis.map((epi) => (
                        <tr key={epi.id}>
                            <td>{epi.id}</td>
                            <td>{epi.nome}</td>
                            <td>{epi.descricao}</td>
                            <td>{epi.quantidade}</td>
                            <td className="cadastrar-epi-actions">
                                <button onClick={() => handleEditClick(epi)} className="cadastrar-epi-button-edit">Editar</button>
                                <button onClick={() => handleDelete(epi.id)} className="cadastrar-epi-button-delete">Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CadastrarEpiTela;
