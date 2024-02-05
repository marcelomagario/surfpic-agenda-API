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



// Fotografo

// app.get('/fotografo/cadastro', (req, res) => {
//   // res.render('cadastro');
// });

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


// Praia

app.post('/praia/cadastro', async (req, res) => {
  const { nome_praia, latitude, longitude, direcao_ideal_swell, direcao_ideal_vento } = req.body;
  try {
    const result = await pool.query('INSERT INTO praia(nome_praia, latitude, longitude, direcao_ideal_swell, direcao_ideal_vento) VALUES($1, $2, $3, $4, $5) RETURNING *', [nome_praia, latitude, longitude, direcao_ideal_swell, direcao_ideal_vento]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível salvar a praia' });
  }
});

app.put('/praia/cadastro/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, senha, picture, instagram, whatsapp, email, link } = req.body;
  console.log('Rota fotografo - PUT');
  try {
    const result = await pool.query('UPDATE fotografo SET nome=$1, senha=$2, picture=$3, instagram=$4, whatsapp=$5, email=$6, link=$7 WHERE id=$8 RETURNING *', [nome, senha, picture, instagram, whatsapp, email, link, id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Praia não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível atualizar a Praia' });
  }
});

app.delete('/praia/cadastro/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Rota Praia - DELETE');
  try {
    const result = await pool.query('DELETE FROM praia WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Praia não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível deletar a Praia' });
  }
});

app.get('/praia', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM praia');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar praia:', err);
    res.status(500).json({ error: 'Não foi possível buscar as praias' });
  }
});


// Sessão

app.post('/sessao/cadastro', async (req, res) => {
  const { fotografoid, praiaid, data, hora_inicial, hora_final } = req.body;

  try {
    // Verificar se o fotógrafo existe
    const fotografo = await pool.query('SELECT * FROM fotografo WHERE id=$1', [fotografoid]);
    if (fotografo.rowCount === 0) {
      return res.status(404).json({ error: 'Fotógrafo não encontrado' });
    }

    // Verificar se a praia existe
    const praia = await pool.query('SELECT * FROM praia WHERE id=$1', [praiaid]);
    if (praia.rowCount === 0) {
      return res.status(404).json({ error: 'Praia não encontrada' });
    }

    // Inserir a nova sessão
    const result = await pool.query('INSERT INTO sessao_fotografo(fotografoid, praiaid, data, hora_inicial, hora_final) VALUES($1, $2, $3, $4, $5) RETURNING *', [fotografoid, praiaid, data, hora_inicial, hora_final]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível salvar a sessão' });
  }
});



app.put('/sessao/cadastro/:id', async (req, res) => {
  const { id } = req.params;
  const { fotografoid, praiaid,data, hora_inicial, hora_final } = req.body;
  try {
    const result = await pool.query('UPDATE sessao_fotografo SET fotografoid=$1, praiaid=$2, data=$3, hora_inicial=$4, hora_final=$5 WHERE id=$6 RETURNING *', [fotografoid, praiaid, data, hora_inicial, hora_final, id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Sessão não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível atualizar a Sessão' });
  }
});

app.delete('/sessao/cadastro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM sessao_fotografo WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Sessão não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível deletar a Sessão' });
  }
});

// mostrar todas as sessões
app.get('/sessao', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sf.*, f.nome, f.picture, f.instagram, f.whatsapp, f.email, f.link, p.* 
      FROM sessao_fotografo sf
      INNER JOIN fotografo f ON sf.fotografoid = f.id
      INNER JOIN praia p ON sf.praiaid = p.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar sessão:', err);
    res.status(500).json({ error: 'Não foi possível buscar as sessões' });
  }
});

// mostrar todas as sessões de um fotografo
app.get('/sessao/fotografo/:fotografoid', async (req, res) => {
  const { fotografoid } = req.params;
  try {
    const result = await pool.query('SELECT * FROM sessao_fotografo WHERE fotografoid=$1', [fotografoid]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível buscar as sessões' });
  }
});

// Iniciando o servidor

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});