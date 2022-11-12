const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to Mongo. Database name: ${connection.connections[0].name}`)
    } catch (error) {
        console.log(error, 'Not connected')
    }
}

module.exports = connect