const { render } = require('ejs');
const express = require('express');
const Author = require('../models/Author');
const authors = require('../models/Author');
const Book = require('../models/Book');

const router = express.Router();

//Get All Authors
router.get('/',async (req, res) => { 
    let searchopject={};
    if(req.query.Name!=null&&req.query.Name!=='')
    {
        searchopject.Name=new RegExp(req.query.Name,'i');
    }
        const allauthor=await authors.find(searchopject);
        res.render('./Authors/Index',{authors:allauthor})});


// Init Create
router.get('/Create', (req, res) => { res.render('Authors/Create', { author: new authors() }) });
router.post('/Create',async (req, res) => {
    const addauthor = new authors({
        Name: req.body.Name
 
    });
    try {
        const newauthor = await addauthor.save();
        // res.redirect(`/${newauthor.id}`);
        res.redirect('/Author');

    }catch (error) {
        res.render('Authors/Create', {
            author: addauthor,
            errormessage: 'Error when Create Author'

        })
        
    }

});
//Get Author BY Id
router.get('/:id',async(req,res)=>{const oldauthor=await authors.findById(req.params.id);const aubooks=await Book.find({'Author':oldauthor.id}); res.render('Authors/Detail',{author:oldauthor,AuthorBook:aubooks}); });
router.get('/:id/edit',async(req,res)=>{const oldauthor=await authors.findById(req.params.id); res.render('Authors/Edit', { author: oldauthor });});
router.put('/:id',async(req,res)=>{
    let oldauthor=await authors.findById(req.params.id);
    oldauthor.Name=req.body.Name;
   await oldauthor.save();
   res.redirect(`/Author/${oldauthor.id}`);
});
router.delete('/:id',async(req,res)=>{  
    let oldauthor;
    try{
           oldauthor=await authors.findById(req.params.id);
   await oldauthor.remove();
   res.redirect('/Author');
    }
    catch{
        res.redirect(`/Author/${oldauthor.id}`);
    }
});
module.exports = router;