const { render } = require('ejs');
const express = require('express');
const Author = require('../models/Author');
const authors = require('../models/Author');
const Book = require('../models/Book');
const {body,validationResult}=require('express-validator');
var authorValidation=(params)=> [
    body(params).notEmpty().withMessage('This Field is Required')
    
    
    ];
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
router.get('/Create', (req, res) => { res.render('Authors/Create', { author: new authors(),errormessage:null }) });
router.post('/Create',authorValidation(['Name','Description','CoverImageName']),async (req, res) => {
    const errors=validationResult(req);
    const addauthor = new authors({
        Name: req.body.Name,
        Description:req.body.Description
    });
    if(errors.isEmpty()){
        SaveImageCover(addauthor,req.body.CoverImageName);
        const newauthor = await addauthor.save();
                 res.redirect(`/Author/${newauthor.id}`);
               
    }
  else{
       res.render('Authors/Create', {
            author: addauthor,
            errormessage: errors.array()

        })
  }
   

});
//Get Author BY Id
router.get('/:id',async(req,res)=>{const oldauthor=await authors.findById(req.params.id);const aubooks=await Book.find({'Author':oldauthor.id}); res.render('Authors/Detail',{author:oldauthor,AuthorBook:aubooks}); });
router.get('/:id/edit',async(req,res)=>{const oldauthor=await authors.findById(req.params.id); res.render('Authors/Edit', { author: oldauthor,errormessage:null });});
router.put('/:id',authorValidation(['Name','Description']),async(req,res)=>{
    const errors=validationResult(req); 
    let oldauthor=await authors.findById(req.params.id);
    if (errors.isEmpty()) {
         oldauthor.Name=req.body.Name;
         oldauthor.Description=req.body.Description;
         if(req.body.CoverImageName!=null&&req.body.CoverImageName!=''){
            SaveImageCover(oldauthor,req.body.CoverImageName);
   }
   await oldauthor.save();
   res.redirect(`/Author/${oldauthor.id}`);
    } else {
        res.render('Authors/Edit', { author: oldauthor,errormessage:errors.array() });
    }
   
   
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
function  SaveImageCover(author,encodeCover){
    
    if (encodeCover==null)return;
    const cover=JSON.parse(encodeCover);
    if (cover!=null) {
       
        author.CoverImageName=new Buffer.from(cover.data,'base64');
        author.CoverImageType=cover.type;
    }

}
module.exports = router;