//CALL MODULES
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//CREATE SCHEMA
const authorSchema = new Schema({
    name: { type: String, required: true }
});

//EXPORT MODEL
module.exports = mongoose.model('Author', authorSchema);