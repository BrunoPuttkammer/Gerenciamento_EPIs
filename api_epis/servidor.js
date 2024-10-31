import express from 'express';
const app = express();
import router from './routes/sistema.js'
import cors from 'cors';

app.use(express.json());
app.use(cors());

app.use(router);

app.listen(3001, () => console.log('Servidor iniciado na porta 3001'));