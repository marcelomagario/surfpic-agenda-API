// Inicializando o Express e o Sequelize
const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');
const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sequelize = new Sequelize('postgres', 'postgres', 'pass', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

// Testando a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
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

app.get('/fotografos/cadastro', (req, res) => {
  res.render('cadastro');
});

app.post('/fotografos', async (req, res) => {
  const fotografo = await Fotografo.create(req.body);
  console.log('Rota fotografos - POST');
  res.redirect('/fotografos');
});

app.get('/fotografos', async (req, res) => {
  // const fotografos = await Fotografo.findAll({include: 'praia'});
  const fotografos = await Fotografo.findAll();
  res.render('lista', { fotografos });
  console.log('Rota fotografos - GET');
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