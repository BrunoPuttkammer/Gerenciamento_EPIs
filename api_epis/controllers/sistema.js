import database from '../database.js';


//epi --------------------------------------------------------------------------------------------

const listarEpi = async (req, res) => {
    try {
        const resultado = await database.query('SELECT id, nome, descricao, quantidade FROM epis');
        res.status(200).send(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao listar EPIs' });
    }
};

const detalhesEpi = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await database.query(`SELECT id, nome, descricao, quantidade FROM epis WHERE id= '${id}'`);
        res.status(200).send(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao listar EPI' });
    }
};

const cadastrarEpi = async (req, res) => {
    const { nome, descricao, quantidade } = req.body;
    try {
        const novoEpi = await database.query(
            `INSERT INTO public.epis ( nome, descricao, quantidade) VALUES ($1, $2, $3) RETURNING ID`,
            [nome, descricao, quantidade]
        );
        res.status(201).send({ mensagem: 'EPI adicionado!', epi: novoEpi.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao cadastrar EPI' });
    }
};

const atualizarEpi = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, quantidade } = req.body;
    try {
        await database.query(
            `UPDATE public.epis
            SET nome='${nome}', descricao='${descricao}', quantidade='${quantidade}'
            WHERE id = '${id}';`
        );
        res.status(201).send({ mensagem: 'EPI atualizado!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao atualizar EPi' });
    }
};

const removerEpi = async (req, res) => {
    const { id } = req.params;
    try {
        await database.query(
            `DELETE FROM public.epis
            WHERE id= '${id}';`
        );
        res.status(201).send({ mensagem: 'EPI deletado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao deletar EPI' });
    }
};

//Funcionários --------------------------------------------------------------------------------------------

const listarFuncionario = async (req, res) => {
    try {
        const resultado = await database.query('SELECT id, nome, telefone FROM funcionarios');
        res.status(200).send(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao listar Funcionários' });
    }
};

const detalhesFuncionario = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await database.query(`SELECT id, nome, telefone FROM epis WHERE id= '${id}'`);
        res.status(200).send(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao listar Funcionário' });
    }
};

const cadastrarFuncionario = async (req, res) => {
    const { nome, telefone } = req.body;
    try {
        await database.query(
            `INSERT INTO public.funcionarios ( nome, telefone ) VALUES ($1, $2)`,
            [nome, telefone]
        );
        res.status(201).send({ mensagem: 'Funcionário adicionado!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao cadastrar Funcionário' });
    }
};

const atualizarFuncionario = async (req, res) => {
    const { id } = req.params;
    const { nome, telefone } = req.body;
    try {
        await database.query(
            `UPDATE public.funcionarios
            SET nome='${nome}', telefone='${telefone}'
            WHERE id = '${id}';`
        );
        res.status(201).send({ mensagem: 'Funcionário atualizado!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao atualizar Funcionário' });
    }
};

const removerFuncionario = async (req, res) => {
    const { id } = req.params;
    try {
        await database.query(
            `DELETE FROM public.funcionarios
            WHERE id= '${id}';`
        );
        res.status(201).send({ mensagem: 'Funcionário deletado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao deletar Funcionário' });
    }
};

//Movimentações --------------------------------------------------------------------------------------------

const listarMovimentacao = async (req, res) => {
    try {
        const resultado = await database.query(
            'SELECT m.id, m.data, f.nome AS funcionario_nome, e.nome AS epi_nome, m.acao FROM movimentacoes m JOIN funcionarios f ON m.id_funcionario = f.id JOIN epis e ON m.id_epi = e.id ORDER BY m.data DESC'
        );

        const dadosFormatados = resultado.rows.map(mov => ({
            id: mov.id,
            data: new Date(mov.data).toLocaleString(),
            funcionario_nome: mov.funcionario_nome,
            epi_nome: mov.epi_nome,
            acao: mov.acao
        }));

        res.status(200).send(dadosFormatados);
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao listar Movimentaçõess' });
    }
};

const retirarMovimentacao = async (req, res) => {
    const { id_funcionario, id_epi, quantidade } = req.body;

    if (!id_funcionario || !id_epi || !quantidade || quantidade <= 0) {
        return res.status(400).send({ mensagem: 'Dados inválidos. Verifique id_funcionario, id_epi e quantidade.' });
    }

    try {
        await database.query('BEGIN');

        const resultado = await database.query(
            `SELECT quantidade FROM public.epis WHERE id = $1`,
            [id_epi]
        );

        if (resultado.rows.length === 0) {
            await database.query('ROLLBACK');
            return res.status(400).send({ mensagem: 'EPI não encontrado.' });
        }

        const quantidadeDisponivel = resultado.rows[0].quantidade;

        if (quantidadeDisponivel < quantidade) {
            await database.query('ROLLBACK');
            return res.status(400).send({ mensagem: `Quantidade insuficiente de EPIs. Disponível: ${quantidadeDisponivel}.` });
        }

        for (let i = 0; i < quantidade; i++) {
            await database.query(
                `INSERT INTO public.movimentacoes (id_funcionario, id_epi, acao) VALUES ($1, $2, 'retirou')`,
                [id_funcionario, id_epi]
            );
        }

        await database.query(
            `UPDATE public.epis SET quantidade = quantidade - $1 WHERE id = $2`,
            [quantidade, id_epi]
        );

        await database.query('COMMIT');
        res.status(201).send({ mensagem: 'Movimentação de retirada registrada e quantidade de EPI atualizada!' });
    } catch (error) {
        await database.query('ROLLBACK');
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao registrar movimentação de retirada.' });
    }
};

const devolverMovimentacao = async (req, res) => {
    const { id_funcionario, id_epi, quantidade } = req.body;

    if (!id_funcionario || !id_epi || !quantidade || quantidade <= 0) {
        return res.status(400).send({ mensagem: 'Dados inválidos. Verifique id_funcionario, id_epi e quantidade.' });
    }

    try {
        await database.query('BEGIN');

        const resultadoRetirou = await database.query(
            `SELECT COUNT(*) AS total_retiradas FROM public.movimentacoes WHERE id_funcionario = $1 AND id_epi = $2 AND acao = 'retirou'`,
            [id_funcionario, id_epi]
        );
        const totalRetiradas = parseInt(resultadoRetirou.rows[0]?.total_retiradas || 0, 10);

        const resultadoDevolveu = await database.query(
            `SELECT COUNT(*) AS total_devolucoes FROM public.movimentacoes WHERE id_funcionario = $1 AND id_epi = $2 AND acao = 'devolveu'`,
            [id_funcionario, id_epi]
        );
        const totalDevolucoes = parseInt(resultadoDevolveu.rows[0]?.total_devolucoes || 0, 10);

        const saldoRetiradas = totalRetiradas - totalDevolucoes;

        if (quantidade > saldoRetiradas) {
            await database.query('ROLLBACK');
            return res.status(400).send({ mensagem: `Quantidade devolvida excede o saldo disponível para devolução. Saldo disponível: ${saldoRetiradas}.` });
        }

        for (let i = 0; i < quantidade; i++) {
            await database.query(
                `INSERT INTO public.movimentacoes (id_funcionario, id_epi, acao) VALUES ($1, $2, 'devolveu')`,
                [id_funcionario, id_epi]
            );
        }

        await database.query(
            `UPDATE public.epis SET quantidade = quantidade + $1 WHERE id = $2`,
            [quantidade, id_epi]
        );

        await database.query('COMMIT');
        res.status(201).send({ mensagem: 'Movimentação de devolução registrada e quantidade de EPI atualizada!' });
    } catch (error) {
        await database.query('ROLLBACK');
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao registrar movimentação de devolução.' });
    }
};


const removerMovimentacao = async (req, res) => {
    const { id } = req.params;
    try {
        await database.query(
            `DELETE FROM public.movimentacoes
            WHERE id= '${id}';`
        );
        res.status(201).send({ mensagem: 'Movimentação removida com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao remover Movimentação' });
    }
};

export {
    listarEpi, detalhesEpi, cadastrarEpi, atualizarEpi, removerEpi,
    listarFuncionario, detalhesFuncionario, cadastrarFuncionario, atualizarFuncionario, removerFuncionario,
    listarMovimentacao, retirarMovimentacao, devolverMovimentacao, removerMovimentacao
};