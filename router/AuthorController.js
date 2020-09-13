const express = require('express');
const authors = require('../models/Author');
const router = express.Router();
//Get All Authors
router.get('/',async (req, res) => { 
        const allauthor=await authors.find({});
        res.render('./Authors/Index',{authors:allauthor})});
router.get('/Author/Create', (req, res) => { res.render('Authors/Create', { author: new authors() }) });
router.post('/Author/Create',async (req, res) => {
    const addauthor = new authors({
        Name: req.body.Name

    });
    try {
        const newauthor = await addauthor.save();
        // res.redirect(`/${newauthor.id}`);
        res.redirect('/');

    }catch (error) {
        res.render('Authors/Create', {
            author: addauthor,
            errormessage: 'Error when Create Author'

        })
        
    }

});
module.exports = router;