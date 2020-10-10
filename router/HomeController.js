const express = require('express');
const author = require('../models/Author');
const Book = require('../models/Book');
const router = express.Router();
//Get All Book
const CheckAuthenticated=(req,res,next)=>{
if (req.isAuthenticated()) {
    return next();
}
res.redirect('/Account/Login');
}
router.get('/',CheckAuthenticated, async (req, res) => {

    let query = Book.find().populate('Author').sort({ 'CreatedAt': 'desc' }).limit(10);
    const allauthors=await author.find({});
    const allBook = await query.exec();
    let user=req.user;
    res.render('./Home/Index', { books: allBook,authors:allauthors,name:user.Name })
});

module.exports = router;