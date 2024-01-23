const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB (certifique-se de ter o MongoDB instalado e rodando localmente)
mongoose.connect('mongodb://localhost:27017/previsao-ondas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Definir o modelo do comentário
const Comment = mongoose.model('Comment', {
    text: String,
});

// Rota para obter a previsão de ondas
app.get('/previsao-ondas', async (req, res) => {
    try {
        console.log('Previsão vai aparecer aqui, da API')
        // Chame a API de previsão de ondas (substitua a URL pela API que você deseja usar)
        // const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=YOUR_CITY&appid=YOUR_API_KEY');

        // // Extraia os dados relevantes da resposta da API
        // const waveForecast = response.data.waves;

        // // Envie a previsão de ondas como resposta
        // res.json({ waveForecast });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter a previsão de ondas.' });
    }
});

// Rota para obter e adicionar comentários
app.route('/comentarios')
    .get(async (req, res) => {
        try {
            // Obtenha todos os comentários do banco de dados
            const comments = await Comment.find();
            res.json({ comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao obter os comentários.' });
        }
    })
    .post(express.json(), async (req, res) => {
        try {
            // Adicione um novo comentário ao banco de dados
            const { text } = req.body;
            const newComment = new Comment({ text });
            await newComment.save();
            res.status(201).json({ message: 'Comentário adicionado com sucesso.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao adicionar o comentário.' });
        }
    });

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});