// CALL MODULE AND METHODS
const router = require('express').Router();
//const multer = require('multer'); // YA NO SE NECESITA MULTER
//const path = require('path');
//const fs = require('fs'); //adminsitrador de archivos

//CALL MODEL
const Book = require('../models/book-model');
const Author = require('../models/author-model');

//PATH TO UPLOAD IMAGES (YA NO SE NECESITA YA QUE MULTER LO DEJE DE USAR)
//const uploadPath = path.join(__dirname, '../public', Book.coverImageBasePath);

//MULTER: UPLOADING IMAGE
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; //le doy todos los tipos de formatos
/* YA NO SE NECESITA YA QUE MULTER YA NO ES USADO
const upload = multer({ dest: uploadPath, fileFilter: (req, file, callback) => { //asi lo hago para la subido de fotos
    callback(null, imageMimeTypes.includes(file.mimetype)); //el null es en caso de error y el otro e para aceptar todos los formatos
} }); //con filefilter puedo filtrar los formatos o archivos que puede aceptar el servidor
*/

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
router.post('/new', /*upload.single('cover'), */async (req, res) => { //como estoy creando mi colleccion coloco el upload para subir mi archivo le pongo cover ya que asi se van a llamar mis datos de imagenes / YA NO NECESITO UPLOAD.SINGLE YA QUE USO FILEPOND FILE ENCODE
    //const fileName = req.file != null ? req.file.filename : null; //doy un estamento para tener el nombre del archivo digo si req.file es diferente de null dame el nombre sino es null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //hago esto ya que el req.body.publishDate va a devolver un string que al pasarlo al new Date lo convertira en fecha que es lo que recibe nuestro modelo
        pageCount: req.body.pageCount,
        //coverImageName: fileName,
        description: req.body.description
    });
    //SAVE OUR COVER (UPLOADING FILE INTO BOOK MODEL)
    saveCover(book, req.body.cover); //requiero encoded json y lo llamare con req.body.cover ya que over es el name de mi input en el formulario html
    try {
        const newBook = await book.save();
        res.redirect(`/books/${newBook.id}`);
    } catch {
        /*
        if (book.coverImageName != null) {// solo quiero llamar la funcion si es que tengo un coverImageName sino no
            removeBookCover(book.coverImageName); //YA QUE SINO TENGO UN COVERIMAGENAME NO TENDRIA SENTIDO
        } */
        renderNewPage(res, book, true);
    }
});

//SHOW SINGLE BOOK
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec(); //PARA VER LA INFORMACION DE CADA LIBRO SABEMOS QUE ESTA ESTA LINKEADA A ALGUN AUTOR POR ESO CON LA FUNCION POPULATE QUE INDICA QUE CAMINOS ESTA LINKEADO EL LIBRO ES DECIR EL LIBOR ESTA LINKEADO AL DOCUEMNTO LLAMADO AUTHOR Y QUIERO TRAER ESA INFORMACION
        res.render('books/show-book.html', { book });
    } catch {
        res.redirect('/');
    }
});

//UPDATE OR EDIT BOOK
//Get Edit Form
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book);
    } catch {
        res.redirect('/');
    }
});

//Update the Book using Put
router.put('/:id/edit', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.description = req.body.description;
        book.pageCount = req.body.pageCount;
        if(req.body.cover != null && req.body.cover !== '') { // si cover existe entonces ejecuto la funcion
            saveCover(book, req.body.cover); //lo hago con el fin de que al editar en el formulario la imagen sale vacia por lo tanto no quiero editar ese documento con una imagen vacia en caso no edite el cover entonces este no se sobreescribira o editara en la base de datos
        }
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch {
        if (book != null) {
            renderEditPage(res, book, true); //en caso falle el guardado quiero que lo redireccione denuevo a la pagina
        } else {
            res.redirect('/');
        }
    }    
});

//DELETE BOOK
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books');
    } catch {
        if (book != null) {
            res.render('books/show-book.html', { book, errorMessage: 'Could not remove Bool!!'} );
        } else {
            res.redirect('/');
        }
    }
});

//USEFUL FNCTIONS FOR MY LOGIC
//REMOVE COVER IMAGES FUNCTIONS
/*
function removeBookCover (fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => { //le doy la direccion para eso concateno con el nimbre para que sepa cual eliminar
        if (err) console.error(err)
    });
};
*/

//EDIT FUNCTION
async function renderEditPage (res, book, hasError = false) { //coloco hasError en false porque no habra error solo en caso haya se coloca en true
    renderFormPage(res, book, 'edit', hasError); //de esta manera minimiso la cantidad de codigo
};

//RENDER FUNCTION (Contains all logic in one place even from two different routes)
async function renderNewPage (res, book, hasError = false) { //coloco hasError en false porque no habra error solo en caso haya se coloca en true
    /* COMO YA HICE UNA FUNCION REUSABLE LO PUEDO RESUMIR ASI
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
    */
   renderFormPage(res, book, 'new', hasError);
};

//RECIVE AND SAVE OUR ENCODED CODE FOR THE IMAGE FILE
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) { //digo si coverEncoded es no valido quiero que se ejecute
        return //si es nulo no quiero que haga nada
    }
    const cover = JSON.parse(coverEncoded); //lo que quiero es uncoded ya que tengo un string uncoded ya que estoy recibiendo un string y quiero pasarlo a JSON y parser el string a un JSON en un simple objeto JSON llamado cover
    if (cover != null && imageMimeTypes.includes(cover.type)) { //hago una segunda validacion para verificar que no hay un string vacio o en caso haya una mala forma de javascript y verificar que el archivo o formato de archivo sea el correcto
        book.coverImage = new Buffer.from(cover.data, 'base64'); //guardo la info en coverImage pero no la puedo guardar asi nomas la transoformo en Buffer para eso le doy el dato y y en que tipo esta en este caso base64 encoded
        book.coverImageType = cover.type;
    }
};

//REUSABLE FUNCTION (Repetitive Function)
async function renderFormPage (res, book, form, hasError = false) { //coloco hasError en false porque no habra error solo en caso haya se coloca en true
    try {
        const authors = await Author.find();
        //const book = new Book(); cuando traigo a parte la funcion no necesito esta linea ya que se la estoy pasando desde mi fucnion puede ser un nuevo book o uno existente
        const params = { authors, book }; //para poder crear dinamicamente este menaje de error creo esta variable Y LUEGO QUIERO AGREGAR A ESTE PARAMS UN ERROR DE MANERA DINAMICA
        if (hasError) { //de esta manera creo mi error de manera dinamica solo cuando haya algun error
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book!!';
            } else {
                params.errorMessage = 'Error Creating Book!!';
            }
        }
        res.render(`books/${form}.html`, params); //De esta forma hago dinamico la funcion
    } catch {
        res.redirect('/books');
    }
};

//EXPORT THE ROUTES
module.exports = router;