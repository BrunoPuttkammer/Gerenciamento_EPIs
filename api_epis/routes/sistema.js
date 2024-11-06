import express from 'express'
const router = express.Router()
import { listarEpi, detalhesEpi, cadastrarEpi, atualizarEpi, removerEpi, listarFuncionario, detalhesFuncionario, 
cadastrarFuncionario, atualizarFuncionario, removerFuncionario, listarMovimentacao, retirarMovimentacao, 
devolverMovimentacao, removerMovimentacao } from '../controllers/sistema.js'

router.get('/epi', listarEpi)
router.get('/epi/:id', detalhesEpi)
router.post('/epi', cadastrarEpi)
router.put('/epi/:id', atualizarEpi)
router.delete('/epi/:id', removerEpi)

router.get('/funcionario', listarFuncionario)
router.get('/funcionario/:id', detalhesFuncionario)
router.post('/funcionario', cadastrarFuncionario)
router.put('/funcionario/:id', atualizarFuncionario)
router.delete('/funcionario/:id', removerFuncionario)

router.get('/movimentacao', listarMovimentacao)
router.post('/movimentacao/retirar', retirarMovimentacao)
router.post('/movimentacao/devolver', devolverMovimentacao)
router.delete('/movimentacao/:id', removerMovimentacao)

export default router