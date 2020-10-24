//CALL MODULES AND METHODS
const express = require('express');
const router = express.Router();

//ROUTES
router.get('/', (req, res) => {
    res.render('index.html');
});

//EXPORTS ROUTES
module.exports = router;