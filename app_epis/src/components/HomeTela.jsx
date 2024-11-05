import React from 'react';
import { Link } from 'react-router-dom';
import './HomeTela.css';

const HomeTela = () => {
    return (
        <div className="home-container">
            <img src="https://ecommerce.sesisenai.org.br/images/logos/sesi-senai.webp" alt="Logo" className="logo" />
            <h1>Sistema de Gerenciamento de EPIs</h1>
            <div className="button-container">
                <Link to="/cadastrar-funcionario" className="button">
                    <div className="icon">👤</div>
                    <p>Cadastrar Funcionário</p>
                </Link>
                <Link to="/cadastrar-epi" className="button">
                    <div className="icon">🛠️</div>
                    <p>Cadastrar EPI</p>
                </Link>
                <Link to="/movimentacao" className="button">
                    <div className="icon">📦</div>
                    <p>Controle de Movimentação</p>
                </Link>
                <Link to="/historico" className="button">
                    <div className="icon">📜</div>
                    <p>Histórico</p>
                </Link>
            </div>
        </div>
    );
};

export default HomeTela;
