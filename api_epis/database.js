import pg from 'pg'

const conexao = new pg.Client("postgresql://bruno:2clpNRH66szJWIm4yYHw9w@senai-api-1688.jxf.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full")

try {
    await conexao.connect()
    console.log('Banco de dados conectou')
} catch (erro) {
    console.log('Erro ao conectar o banco de dados')
    console.log(erro)
}

export default conexao