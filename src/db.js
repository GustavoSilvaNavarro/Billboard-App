//CALL MODULE
const mongoose = require('mongoose');

//ENV VARIABLES
const { DATABASE_NAME, DATABASE_HOST } = process.env;
const DATABASE_URL = `mongodb://${DATABASE_HOST}/${DATABASE_NAME}`;

//CREATE CONECTION
mongoose.connect(DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}). then(db => console.log('DB is connected using', db.connection.host))
.catch(err => console.error(err))