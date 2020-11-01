//CALL MODULES
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//CALL MODEL
const Book = require('./book-model');

//CREATE SCHEMA
const authorSchema = new Schema({
    name: { type: String, required: true }
});

//CREATING CONSTRAINTS (pre permite correr un metodo antes de que alguna accion ocurra)
authorSchema.pre('remove', function(next) { //VA A PREVENIR DE REMOVER O BORRAR UN AUTOR DEFINIDO YA EN UN LIBRO
    Book.find({ author: this.id }, (err, books) => { //es una promise con callbacks no uso asincrono
        if (err) {
            next(err); //va a pasar el error a la siguiente funcion
        } else if (books.length > 0) {//recibo lista de libros asociados a ese autor si es 0 significa que no hya ninguno asociado si da valor es que si esta asociado
            next(new Error('This author has books still!!')); //esto quiere decir que no lo quiero borrar ya que esta linkeado el autor a libros previene de borrar el author
        } else {
            next(); // dejo en vacio lo cual le indica a mongoose que todo esta bien no hay libros asociados y no genero ningun error asi que se puede borrar de la base de datos
        }
    });
});

//EXPORT MODEL
module.exports = mongoose.model('Author', authorSchema);