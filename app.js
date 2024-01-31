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
const tbfotografo = sequelize.define('fotografo', {
  nome: Sequelize.STRING,
  senha: Sequelize.STRING,
  picture: Sequelize.STRING,
  instagram: Sequelize.STRING,
  whatsapp: Sequelize.STRING,
  email: Sequelize.STRING,
  link: Sequelize.STRING
}, {
  freezeTableName: true
});

// Definindo o modelo Praia
const Praia = sequelize.define('praia', {
  nome_praia: Sequelize.STRING,
  localizacao: Sequelize.GEOMETRY('POINT'),
  direcao_ideal_swell: Sequelize.STRING,
  direcao_ideal_vento: Sequelize.STRING
}, {
  freezeTableName: true
});

// Definindo o modelo SessaoFotografo
const SessaoFotografo = sequelize.define('sessao_fotografo', {
  data: Sequelize.DATE,
  hora_inicial: Sequelize.TIME,
  hora_final: Sequelize.TIME
}, {
  freezeTableName: true
});

// Definindo as relações
tbfotografo.hasMany(SessaoFotografo, { foreignKey: 'fotografoId' });
SessaoFotografo.belongsTo(tbfotografo, { foreignKey: 'fotografoId' });

Praia.hasMany(SessaoFotografo, { foreignKey: 'praiaId' });
SessaoFotografo.belongsTo(Praia, { foreignKey: 'praiaId' });

// Sincronizando os modelos com o banco de dados
sequelize.sync();


app.get('/fotografo/cadastro', (req, res) => {
  res.render('cadastro');
});


app.post('/fotografo/cadastro', async (req, res) => {
  const { nome, senha, picture, instagram, whatsapp, email, link } = req.body;
  try {
    const novoFotografo = await tbfotografo.create({ nome, senha, picture, instagram, whatsapp, email, link });
    res.json(novoFotografo);
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
    const fotografo = await tbfotografo.findByPk(id);
    if (fotografo) {
      await tbfotografo.update({ nome, senha, picture, instagram, whatsapp, email, link }, {
        where: {
          id: id
        }
      });
      res.json(fotografo);
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
    const fotografo = await tbfotografo.findByPk(id);
    if (fotografo) {
      await fotografo.destroy();
      res.json(fotografo);
    } else {
      res.status(404).json({ error: 'Fotógrafo não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível deletar o fotógrafo' });
  }
});

// Rota para listar todos os fotografos
app.get('/fotografo', async (req, res) => {
  try {
    const listaFotografos = await tbfotografo.findAll();
    res.json(listaFotografos);
    // res.render('lista', { fotografo: listaFotografos });
  } catch (err) {
    console.error('Erro ao buscar fotografos:', err);
    res.status(500).json({ error: 'Não foi possível buscar os fotografos' });
  }
}
);


// Iniciando o servidor
app.listen(3000, async () => {
  await sequelize.sync();
  console.log('Servidor rodando na porta 3000');
});