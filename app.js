// Inicializando o Express e o Sequelize
const express = require('express');
const Sequelize = require('sequelize');
const app = express();
app.use(express.json());

const sequelize = new Sequelize('surfpics_agenda', 'marcelomagario', 'surflife2024', {
  host: 'localhost',
  dialect: 'postgres'
});

// Definindo os modelos
const Fotografo = sequelize.define('fotografo', {
  nome: Sequelize.STRING,
  senha: Sequelize.STRING,
  dia: Sequelize.DATEONLY,
  horaInicio: Sequelize.TIME,
  horaFinal: Sequelize.TIME,
  praiaId: Sequelize.INTEGER
});

const Praia = sequelize.define('praia', {
  nome: Sequelize.STRING
});

Fotografo.belongsTo(Praia, {as: 'praia'});

// Rotas
app.post('/fotografos', async (req, res) => {
  const fotografo = await Fotografo.create(req.body);
  res.json(fotografo);
});

app.get('/fotografos', async (req, res) => {
  const fotografos = await Fotografo.findAll({include: 'praia'});
  res.json(fotografos);
});

app.post('/praias', async (req, res) => {
  const praia = await Praia.create(req.body);
  res.json(praia);
});

// Iniciando o servidor
app.listen(3000, async () => {
  await sequelize.sync();
  console.log('Servidor rodando na porta 3000');
});