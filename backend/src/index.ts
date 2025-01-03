import express, { Request, Response } from 'express';

interface Usuario {
  nome: string;
  idade: number;
}

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Olá do TypeScript com Express!');
});

app.get('/usuarios', (req: Request, res: Response) => {
  const usuarios: Usuario[] = [{ nome: 'João', idade: 30 }, { nome: 'Maria', idade: 25 }]
  res.json(usuarios)
})

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});