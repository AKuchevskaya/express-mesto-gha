const express = require('express');
const mongoose = require('mongoose');

const {PORT = 3000} = process.env;

const app = express();
//подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
//подключаем мидлвары, роуты и тд

app.use(express.static(path.resolve(__dirname, 'build')))
app.listen(PORT, () => {
    console.log('App started', PORT)
})