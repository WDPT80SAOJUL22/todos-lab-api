const express = require('express');
const connectDb = require('./config/db.config.js');
const morgan = require('morgan');
require('dotenv').config();

connectDb();
const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Tá funcionando')
})

app.use('/todos', require('./routes/todos.routes.js'));

app.listen(process.env.PORT, () => {
    console.log(`Server listen on Port ${process.env.PORT}`)
});