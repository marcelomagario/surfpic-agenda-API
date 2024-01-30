// Inicializando o Express e o Sequelize
const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const fotografos = sequelize.define('fotografos', {
  nome: Sequelize.STRING,
  senha: Sequelize.STRING,
  picture: Sequelize.STRING,
  instagram: Sequelize.STRING,
  whatsapp: Sequelize.STRING,
  email: Sequelize.STRING,
  link: Sequelize.STRING
});

// sequelize.sync({ force: true }).catch(console.error);

// const Sessao = sequelize.define('sessao', {
//   fotografo: Sequelize.STRING,
//   dia: Sequelize.DATEONLY,
//   horaInicio: Sequelize.TIME,
//   horaFinal: Sequelize.TIME,
//   praiaId: Sequelize.INTEGER
// });

// const Praia = sequelize.define('praia', {
//   nome: Sequelize.STRING
// });

// Fotografo.belongsTo(Praia, {as: 'praia'});

// Rotas

app.get('/fotografos/cadastro', (req, res) => {
  res.render('cadastro');
});

app.post('/fotografos', async (req, res) => {
  const novoFotografo = await fotografos.create(req.body);
  console.log('Rota fotografos - POST');
  res.redirect('/fotografos');
});

app.get('/fotografos', async (req, res) => {
  const listaFotografos = await fotografos.findAll();
  res.render('lista', { fotografos: listaFotografos });
  console.log('Rota fotografos - GET');
  res.json(listaFotografos);
});

// app.post('/praias', async (req, res) => {
//   const praia = await Praia.create(req.body);
//   res.json(praia);
// });

// Iniciando o servidor
app.listen(3000, async () => {
  await sequelize.sync();
  console.log('Servidor rodando na porta 3000');
});