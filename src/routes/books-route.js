// CALL MODULE AND METHODS
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); //adminsitrador de archivos

//CALL MODEL
const Book = require('../models/book-model');
const Author = require('../models/author-model');

//PATH TO UPLOAD IMAGES
const uploadPath = path.join(__dirname, '../public', Book.coverImageBasePath);

//MULTER: UPLOADING IMAGE
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; //le doy todos los tipos de formatos
const upload = multer({ dest: uploadPath, fileFilter: (req, file, callback) => { //asi lo hago para la subido de fotos
    callback(null, imageMimeTypes.includes(file.mimetype)); //el null es en caso de error y el otro e para aceptar todos los formatos
} }); //con filefilter puedo filtrar los formatos o archivos que puede aceptar el servidor


//CREATE ROUTES FOR BOOKS
//Get All Books
router.get('/', async (req, res) => {
    //ahora vamos a hacer que los filtros de busqueda funcionen
    let query = Book.find(); //objeto creado que llamare abajo cuando le termine de ejcutar algo
    //FILTRO TITULO
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    //FILTRO DE BEFORE
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore); //usar expresion de menor que o igual que signifca en javascript lte()
    } //lo que le digo es que si el dato de publish Date es menor o igual al publisehdBefore continuara y retornara ese objeto
    //FILTRO AFTER
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter); //usar expresion de mayor que o igual que signifca en javascript gte()
    } // en este caso si publishDate es mayor o igual que el publishedAfter retornara un objeto
    try {
        const books = await query.exec(); // en lugar de Book.find(); coloco esto / ES DECIR LE DIGO EJECUTA EL QUERY ANTERIOR
        res.render('books/all-books.html', { books: books, searchOptions: req.query });
    } catch {
        res.redirect('/');
    }
});

//New Book Form
router.get('/new', async (req, res) => { //debo pasar todas las opciones de autor para poder seleccionarlo
    const book = new Book();
    renderNewPage(res, book); //no es necesario pasar error porque no tendra
});

//POST Create New Book
router.post('/new', upload.single('cover'), async (req, res) => { //como estoy creando mi colleccion coloco el upload para subir mi archivo le pongo cover ya que asi se van a llamar mis datos de imagenes
    const fileName = req.file != null ? req.file.filename : null; //doy un estamento para tener el nombre del archivo digo si req.file es diferente de null dame el nombre sino es null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //hago esto ya que el req.body.publishDate va a devolver un string que al pasarlo al new Date lo convertira en fecha que es lo que recibe nuestro modelo
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    });
    try {
        const newBook = await book.save();
        //res.redirect(`/books/${newBook.id}`);
        res.redirect('/books');
    } catch {
        if (book.coverImageName != null) {// solo quiero llamar la funcion si es que tengo un coverImageName sino no
            removeBookCover(book.coverImageName); //YA QUE SINO TENGO UN COVERIMAGENAME NO TENDRIA SENTIDO
        }
        renderNewPage(res, book, true);
    }
});

//USEFUL FNCTIONS FOR MY LOGIC
//REMOVE COVER IMAGES FUNCTIONS
function removeBookCover (fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => { //le doy la direccion para eso concateno con el nimbre para que sepa cual eliminar
        if (err) console.error(err)
    });
};

//REUSABLE FUNCTION (Contains all logic in one place even from two different routes)
async function renderNewPage (res, book, hasError = false) { //coloco hasError en false porque no habra error solo en caso haya se coloca en true
    try {
        const authors = await Author.find();
        //const book = new Book(); cuando traigo a parte la funcion no necesito esta linea ya que se la estoy pasando desde mi fucnion puede ser un nuevo book o uno existente
        const params = { authors, book }; //para poder crear dinamicamente este menaje de error creo esta variable Y LUEGO QUIERO AGREGAR A ESTE PARAMS UN ERROR DE MANERA DINAMICA
        if (hasError) { //de esta manera creo mi error de manera dinamica solo cuando haya algun error
            params.errorMessage = 'Error Creating Book!!'
        }
        res.render('books/new.html', params);
    } catch {
        res.redirect('/books');
    }
};

//EXPORT THE ROUTES
module.exports = router;