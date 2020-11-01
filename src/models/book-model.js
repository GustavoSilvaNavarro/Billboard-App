//CALL MODULES AND METHODS
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
//const path = require('path');

//VARIABLE PATH (NO SE NECESITA MAS YA QUE SE DEJO DE USAR MULTER)
//const coverImageBasePath = 'uploads/bookCovers'; //sino tengo estas carpetas se crean de inmediato

//CREATE NEW MODEL FOR BOOKS
const bookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    publishDate: { type: Date, required: true },
    pageCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    //coverImageName: { type: String, required: true },
    coverImage: { type: Buffer, required: true }, //ya no necesito solo el nombre ya que no uso Multer ahoora con FilePond voy a guardar la imagen en si
    coverImageType: { type: String, required: true }, // coloco dentro de mi DB el tipo de imagen si es png o jpeg o gif esto lo hago porque cuando guardo la imagen debo saber que tipo de imagen estoy guardando
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Author' } // de esta manera referencio otro objeto dentro de mi coleccion que se va a estar relacionada o la voy a relacionar con mi modelo author no olvidar poner el ref: y nombre del modelo igualito
});

//CREATING A VIRTUAL PROPERTY
/*ESTO ERA CON MULTER AHORA NO ES CON FILEPOND
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName); // el '/' me dara la ruta public
    }
});
*/

//CREATING VIRTUAL PROPERTY FOR FILEPOND
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
    }
}); //USAREMOS DATA OBJECT FOR HTML QUE PODEMOS USAR COMO SRC O FUENTE QUE PERMITE USAR BUFFER DATA COMO LA FUENTE / EN ESTE CASO LE OY LA FUENTE LE DOY LA CODIFICACION SIEMPRE UTF-8 Y POR ULTIMO COMO ESTA CODIFICADO POR ULTIMO LE PONGO LA DATA QUE LA VOY A CONVERTIR A UN STRING DE BASE 64

//EXPORT SCHEMA AND MODEL
module.exports = model('Book', bookSchema);

//EXPORT MY PATH
/* YA NO SE NECESITA YA QUE NO ESTA MULTER
module.exports.coverImageBasePath = coverImageBasePath; //de esta manera exporto como una variable nombrada no como default
*/