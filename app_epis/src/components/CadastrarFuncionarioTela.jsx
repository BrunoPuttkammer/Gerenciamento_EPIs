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

        if (name === "nome") {
            // Apenas letras e espaços
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === "telefone") {
            // Apenas números, limitando a 11 caracteres
            if (/^\d{0,11}$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        }
    };

    const formatPhoneNumber = (phone) => {
        if (phone.length === 11) {
            return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
        }
        return phone;
    };

    const handleSave = async () => {
        if (formData.nome && formData.telefone.length === 11) {
            try {
                const formattedPhone = formatPhoneNumber(formData.telefone);
                const response = await axios.post('http://localhost:3001/funcionario', {
                    ...formData,
                    telefone: formattedPhone,
                });
                setFuncionarios((prevFuncionarios) => [...prevFuncionarios, response.data]);
                setFormData({ nome: '', telefone: '' });
            } catch (error) {
                console.error("Erro ao salvar funcionário:", error);
            }
        } else {
            alert("Por favor, preencha todos os campos corretamente!");
        }
    };

    const handleUpdate = async () => {
        if (editingId && formData.nome && formData.telefone.length === 11) {
            try {
                const formattedPhone = formatPhoneNumber(formData.telefone);
                const response = await axios.put(`http://localhost:3001/funcionario/${editingId}`, {
                    ...formData,
                    telefone: formattedPhone,
                });
                setFuncionarios((prevFuncionarios) =>
                    prevFuncionarios.map((func) => func.id === editingId ? response.data : func)
                );
                setFormData({ nome: '', telefone: '' });
                setEditingId(null);
            } catch (error) {
                console.error("Erro ao atualizar funcionário:", error);
            }
        } else {
            alert("Por favor, preencha todos os campos corretamente!");
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
        setFormData({ nome: funcionario.nome, telefone: funcionario.telefone.replace(/\D/g, '') });
        setEditingId(funcionario.id);
    };

    const handleCancelEdit = () => {
        setFormData({ nome: '', telefone: '' });
        setEditingId(null);
    };

    return (
        <div className="cadastro-funcionario-form-container">
            <img src="https://ecommerce.sesisenai.org.br/images/logos/sesi-senai.webp" alt="Logo" className="cadastro-funcionario-logo" />
            <h2>Cadastrar Funcionário</h2>
            <div className="cadastro-funcionario-input-group">
                <label>Nome:</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder='Digite aqui...'
                />
            </div>
            <div className="cadastro-funcionario-input-group">
                <label>Telefone:</label>
                <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder='(00)90000-0000'
                />
            </div>
            <div className="cadastro-funcionario-button-group">
                {editingId ? (
                    <>
                        <button onClick={handleUpdate} className="cadastro-funcionario-button-update">Atualizar</button>
                        <button onClick={handleCancelEdit} className="cadastro-funcionario-button-cancel">Cancelar</button>
                    </>
                ) : (
                    <button onClick={handleSave} className="cadastro-funcionario-button-save">Salvar</button>
                )}
            </div>
            <table className="cadastro-funcionario-table">
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
                                <button onClick={() => handleEditClick(funcionario)} className="cadastro-funcionario-button-edit">Editar</button>
                                <button onClick={() => handleDelete(funcionario.id)} className="cadastro-funcionario-button-delete">Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CadastrarFuncionarioTela;
