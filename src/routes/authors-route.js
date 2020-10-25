//CALL MODULES
const { Router } = require('express');
const router = Router();

//CALL SCHEMA
const Author = require('../models/author-model');

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
router.get('/new', (req, res) => {
    res.render('authors/new.html', { author: new Author() });
});

//Create new author
router.post('/new', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        //res.redirect(`/authors/${newAuthor.id}`);
        res.redirect('/authors');
    } catch {
        res.render('authors/new.html', { author, errorMessage: 'Error creating Author' });
    }
});

//EXPORT ROUTES
module.exports = router;