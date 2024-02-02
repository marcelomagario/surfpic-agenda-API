const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'pass',
  port: 5432,
});

app.get('/fotografo/cadastro', (req, res) => {
  res.render('cadastro');
});

app.post('/fotografo/cadastro', async (req, res) => {
  const { nome, senha, picture, instagram, whatsapp, email, link } = req.body;
  try {
    const result = await pool.query('INSERT INTO fotografo(nome, senha, picture, instagram, whatsapp, email, link) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [nome, senha, picture, instagram, whatsapp, email, link]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível salvar o fotógrafo' });
  }
});

app.put('/fotografo/cadastro/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, senha, picture, instagram, whatsapp, email, link } = req.body;
  console.log('Rota fotografo - PUT');
  try {
    const result = await pool.query('UPDATE fotografo SET nome=$1, senha=$2, picture=$3, instagram=$4, whatsapp=$5, email=$6, link=$7 WHERE id=$8 RETURNING *', [nome, senha, picture, instagram, whatsapp, email, link, id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Fotógrafo não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível atualizar o fotógrafo' });
  }
});

app.delete('/fotografo/cadastro/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Rota fotografo - DELETE');
  try {
    const result = await pool.query('DELETE FROM fotografo WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Fotógrafo não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível deletar o fotógrafo' });
  }
});

app.get('/fotografo', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fotografo');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar fotografos:', err);
    res.status(500).json({ error: 'Não foi possível buscar os fotografos' });
  }
});


// Iniciando o servidor

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});