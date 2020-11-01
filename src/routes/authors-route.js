//CALL MODULES
const { Router } = require('express');
const router = Router();

//CALL SCHEMA
const Author = require('../models/author-model');
const Book = require('../models/book-model');

//ROUTES
//GET ALL AUTHORS
router.get('/', async (req, res) => {
    //Create Search Options
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== '') { //coloco req.query ya que todas las solicitudees get viajen por el url mediante query / aqui le digo si es que el name no es nulo o vacio ejecuta
        searchOptions.name = new RegExp(req.query.name, 'i');//VOY A PONER UNA REGULAR EXPRESSION YA QUE LO QUE HACE ES BASICAMENTE BUSCAR POR PARTE DEL TEXTO NO TIENE QUE SER PRECISO PARA ESO SETEO UNA NUEVA REGULAR EXPRESSION ADEMAS DE ESO PASO EL I FLAG QUE CONSISTE EN QUE SI LO PASO EN MAYUSCULA O MINUSCULA VA A DAR MISMO RESULTADO
    }
    try {
        const authors = await Author.find(searchOptions); //coloco el search options aqui asi lo que busco luego lo llamo
        res.render('authors/index.html', { authors, searchOptions: req.query }); //aqui paso el req.query para que en caso pase algo seah rellenado
    } catch {
        res.redirect('/');
    }
});

//New author form
router.get('/new', (req, res) => { //NOTA ES IMPORTANTE QUE ESTA RUTA SEA DEFINIDA PRIMERO ANTES QUE EL ID YA QUE E OTRA FORMA PUEDE GENERAR ERROR AL SERVIDOR YA QUE SI ES DEFNIDA LUEGO DE ID PUEDE PENSAR QUE NEW SERA EL ID
    res.render('authors/new.html', { author: new Author() });
});

//Create new author
router.post('/new', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`/authors/${newAuthor.id}`);
    } catch {
        res.render('authors/new.html', { author, errorMessage: 'Error creating Author' });
    }
});

//SHOW AUTHOR
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show-author.html', { author, booksByAuthor: books })
    } catch {
        res.redirect('/');
    }
});

//EDIT AUTHOR BY ID
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit.html', { author });
    } catch {
        res.redirect('/authors');
    }
});

//edit information about author
router.put('/:id/edit', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch {
        if (author == null) { // de esta manera impido que de manera erronea me envie a la pagina de edicion de un usuario que no existe
            res.redirect('/'); //esto es en caso de que falle el codigo al buscar en la base de datos
        } else { //en caso exista y haya sido error de guardado que me renderice edit
            res.render('authors/edit.html', { author, errorMessage: 'Error Updating Author' });
        }
    }
});

//DELETE AUTHOR
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch {
        if (author == null) { // de esta manera impido que de manera erronea me envie a la pagina de edicion de un usuario que no existe
            res.redirect('/'); //esto es en caso de que falle el codigo al buscar en la base de datos
        } else { //en caso exista algun error al remover o borrar el autor de guardado redirecciono a 
            res.redirect(`/authors/${author.id}`);
        }
    }
});

//EXPORT ROUTES
module.exports = router;