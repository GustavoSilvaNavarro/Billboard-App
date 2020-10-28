//CALL MODULES AND METHODS
const express = require('express');
const router = express.Router();

//CALL MODELS
const Book = require('../models/book-model');

//ROUTES
router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec(); //pongo desc ya que quiero los mas nuevos primero y viejos a lo ultimo coloco exec por el limit(10)
    } catch {
        books = []; // en caso tenga un error quiero que no aparezcan los libros sino una lista vacia
    }
    res.render('index.html', { books });
});

//EXPORTS ROUTES
module.exports = router;