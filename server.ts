import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o front-end acesse a API

// Conecta ou cria o banco de dados em arquivo
const db = new sqlite3.Database('./database.db');

// Cria a tabela inicial se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL
  )
`);

// Interfaces TypeScript para tipagem
interface Tarefa {
  id: number;
  titulo: string;
}

// 1. CREATE (Criar)
app.post('/tarefas', (req, res) => {
  const { titulo } = req.body;
  db.run('INSERT INTO tarefas (titulo) VALUES (?)', [titulo], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ id: this.lastID, titulo });
  });
});

// 2. READ (Ler todas)
app.get('/tarefas', (req, res) => {
  db.all('SELECT * FROM tarefas', [], (err, rows: Tarefa[]) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// 3. UPDATE (Atualizar)
app.put('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;
  db.run('UPDATE tarefas SET titulo = ? WHERE id = ?', [titulo, id], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: "Atualizado com sucesso" });
  });
});

// 4. DELETE (Deletar)
app.delete('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tarefas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: "Removido com sucesso" });
  });
});

app.listen(3000, () => console.log('Back-end rodando em http://localhost:3000'));

