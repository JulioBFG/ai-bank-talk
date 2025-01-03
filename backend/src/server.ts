import app from './app';
import { connectToDatabase } from './config/db';
import config from './config/config'

const port = config.port || 3000;

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}).catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
});