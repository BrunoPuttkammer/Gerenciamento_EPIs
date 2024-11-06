import React, { useState, useEffect } from 'react';
import './CadastrarFuncionarioTela.css'; 
import axios from 'axios';

const CadastrarFuncionarioTela = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        telefone: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const response = await axios.get('http://localhost:3001/funcionario');
                setFuncionarios(response.data);
            } catch (error) {
                console.error("Erro ao carregar funcionários:", error);
            }
        };

        fetchFuncionarios();
    }, [funcionarios]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (formData.nome && formData.telefone) {
            try {
                const response = await axios.post('http://localhost:3001/funcionario', formData);
                setFuncionarios((prevFuncionarios) => [...prevFuncionarios, response.data]);
                setFormData({ nome: '', telefone: '' });
            } catch (error) {
                console.error("Erro ao salvar funcionário:", error);
            }
        } else {
            alert("Por favor, preencha todos os campos!");
        }
    };

    const handleUpdate = async () => {
        if (editingId && formData.nome && formData.telefone) {
            try {
                const response = await axios.put(`http://localhost:3001/funcionario/${editingId}`, formData);
                setFuncionarios((prevFuncionarios) =>
                    prevFuncionarios.map((func) => func.id === editingId ? response.data : func)
                );
                setFormData({ nome: '', telefone: '' });
                setEditingId(null);
            } catch (error) {
                console.error("Erro ao atualizar funcionário:", error);
            }
        } else {
            alert("Por favor, preencha todos os campos!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/funcionario/${id}`);
            setFuncionarios((prevFuncionarios) => prevFuncionarios.filter((func) => func.id !== id));
        } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
        }
    };

    const handleEditClick = (funcionario) => {
        setFormData({ nome: funcionario.nome, telefone: funcionario.telefone });
        setEditingId(funcionario.id);
    };

    const handleCancelEdit = () => {
        setFormData({ nome: '', telefone: '' });
        setEditingId(null);
    };

    return (
        <div className="form-container">
            <h2>Cadastrar Funcionário</h2>
            <div className="input-group">
                <label>Nome:</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                />
            </div>
            <div className="input-group">
                <label>Telefone:</label>
                <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                />
            </div>
            <div className="button-group">
                {editingId ? (
                    <>
                        <button onClick={handleUpdate} className="button-update">Atualizar</button>
                        <button onClick={handleCancelEdit} className="button-cancel">Cancelar</button>
                    </>
                ) : (
                    <button onClick={handleSave} className="button-save">Salvar</button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.map((funcionario) => (
                        <tr key={funcionario.id}>
                            <td>{funcionario.id}</td>
                            <td>{funcionario.nome}</td>
                            <td>{funcionario.telefone}</td>
                            <td>
                                <button onClick={() => handleEditClick(funcionario)} className="button-edit">Editar</button>
                                <button onClick={() => handleDelete(funcionario.id)} className="button-delete">Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CadastrarFuncionarioTela;
