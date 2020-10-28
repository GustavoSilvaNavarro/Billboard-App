//CALL MODULES AND METHODS
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const path = require('path');

//VARIABLE PATH
const coverImageBasePath = 'uploads/bookCovers'; //sino tengo estas carpetas se crean de inmediato

//CREATE NEW MODEL FOR BOOKS
const bookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    publishDate: { type: Date, required: true },
    pageCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    coverImageName: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Author' } // de esta manera referencio otro objeto dentro de mi coleccion que se va a estar relacionada o la voy a relacionar con mi modelo author no olvidar poner el ref: y nombre del modelo igualito
});

//CREATING A VIRTUAL PROPERTY
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName); // el '/' me dara la ruta public
    }
});

//EXPORT SCHEMA AND MODEL
module.exports = model('Book', bookSchema);

//EXPORT MY PATH
module.exports.coverImageBasePath = coverImageBasePath; //de esta manera exporto como una variable nombrada no como default