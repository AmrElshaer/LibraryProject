const express = require('express');
const author = require('../models/Author');
const Book = require('../models/Book');
const router = express.Router();
//Get All Book
router.get('/', async (req, res) => {

    let query = Book.find().populate('Author').sort({ 'CreatedAt': 'desc' }).limit(10);
    const allauthors=await author.find({});
    const allBook = await query.exec();
    res.render('./Home/Index', { books: allBook,authors:allauthors })
});

module.exports = router;