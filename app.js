const express = require('express');
const connectDb = require('./config/db.config.js');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

connectDb();
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Tá funcionando')
})

app.use('/auth', require('./routes/auth.routes.js'));

app.use(require('./middlewares/auth.middlewares.js'));

app.use('/todos', require('./routes/todos.routes.js'));

app.use('/user', require('./routes/user.routes'))

app.listen(process.env.PORT, () => {
    console.log(`Server listen on Port ${process.env.PORT}`)
});