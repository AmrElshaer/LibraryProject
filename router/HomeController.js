const express = require('express');
const author = require('../models/Author');
const Book = require('../models/Book');
const router = express.Router();
//Get All Book
router.get('/', async (req, res) => {

    let query = Book.find().sort({ 'CreatedAt': 'desc' }).limit(10);

    const allBook = await query.exec();
    res.render('./Home/Index', { books: allBook })
});

module.exports = router;