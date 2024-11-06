import database from '../database.js';


//EPIs --------------------------------------------------------------------------------------------

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
        await database.query(
            `INSERT INTO public.epis ( nome, descricao, quantidade) VALUES ($1, $2, $3)`,
            [nome, descricao, quantidade]
        );
        res.status(201).send({ mensagem: 'EPI adicionado!' });
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
            SET nome='${nome}', descricao='${descricao}, quantidade='${quantidade}'
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
            'SELECT m.id, m.data, f.nome AS funcionario_nome, e.nome AS epi_nome, m.acao FROM movimentacoes m JOIN funcionarios f ON m.id_funcionario = f.id JOIN epis e ON m.id_epi = e.id'
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
    const { id_funcionario, id_epi } = req.body;
    try {
        await database.query('BEGIN');

        console.log(`EP: ${id_epi}, F: ${id_funcionario}`)

        const resultado = await database.query(
            `SELECT quantidade FROM public.epis WHERE id = 1`
        );
        
        console.log(resultado.rows)
        if (resultado.rows.length == 0 || resultado.rows[0].quantidade <= 0) {
            await database.query('ROLLBACK');
            return res.status(400).send({ mensagem: 'EPI indisponível para retirada.' });
        }

        await database.query(
            `INSERT INTO public.movimentacoes (id_funcionario, id_epi, acao) VALUES (${id_funcionario}, ${id_epi}, 'retirou')`,
        );

        await database.query(
            `UPDATE public.epis SET quantidade = quantidade - 1 WHERE id = ${id_epi}`,
        );

        await database.query('COMMIT');

        res.status(201).send({ mensagem: 'Movimentação adicionada e quantidade de EPI atualizada!' });
    } catch (error) {
        await database.query('ROLLBACK');
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao adicionar Movimentação' });
    }
};

const devolverMovimentacao = async (req, res) => {
    const { id_funcionario, id_epi } = req.body;
    try {
        await database.query('BEGIN');

        const resultadoRetirou = await database.query(
            `SELECT COUNT(*)  public.movimentacoes (id_funcionario, id_epi, acao) VALUES (${id_funcionario}, ${id_epi}, 'devolveu')`,
            
        );

        const totalRetiradas = parseInt(resultadoRetirou.rows[0].total_retiradas, 10);

        const resultadoDevolveu = await database.query(
            `SELECT COUNT(*) as total_devolucoes FROM public.movimentacoes WHERE id_funcionario = $1 AND id_epi = $2 AND acao = 'devolveu'`,
            [id_funcionario, id_epi]
        );

        const totalDevolucoes = parseInt(resultadoDevolveu.rows[0].total_devolucoes, 10);

        if (totalDevolucoes >= totalRetiradas) {
            await database.query('ROLLBACK');
            return res.status(400).send({ mensagem: 'O usuário já devolveu a EPI(s)' });
        }

        await database.query(
            `INSERT INTO public.movimentacoes (id_funcionario, id_epi, acao) VALUES ($1, $2, 'devolveu')`,
            [id_funcionario, id_epi]
        );

        await database.query(
            `UPDATE public.epis SET quantidade = quantidade + 1 WHERE id = $1`,
            [id_epi]
        );

        await database.query('COMMIT');
        res.status(201).send({ mensagem: 'Movimentação de devolução registrada e quantidade de EPI atualizada!' });
    } catch (error) {
        await database.query('ROLLBACK');
        console.error(error);
        res.status(500).send({ mensagem: 'Erro ao registrar a devolução' });
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