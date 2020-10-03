const express = require('express');
const author=require('../models/Author');
const Book = require('../models/Book');
const router = express.Router();
const path=require('path');
const Author = require('../models/Author');
const {body,validationResult}=require('express-validator');
const imageMimeTypes=['image/png','image/jpg'];
 var bookValidation=(params)=> [
    body(params).notEmpty().withMessage('This Field is Required')
    
    
    ]
//Get All Book
router.get('/',async (req, res) => { 
    
    let query=Book.find().populate('Author');
     
    if (req.query.PriceFrom!=null&&req.query.PriceFrom!=='') {
        query=query.gte('Price',req.query.PriceFrom);
    }
    if (req.query.PriceTo!=null&&req.query.PriceTo!=='') {
        query=query.lte('Price',req.query.PriceTo);
    }
    if(req.query.Name!=null&&req.query.Name!=='')
    {
      query= query.regex('Name',new RegExp(req.query.Name,'i'));
    }
   if (req.query.PublishAfter!=null&& req.query.PublishAfter!='') {
       query=query.gte('PublshDate',req.query.PublishAfter);
   }
   if (req.query.PublishPefore!=null&& req.query.PublishPefore!='') {
    query=query.lte('PublshDate',req.query.PublishPefore);
    }
        const allBook=await query.exec();
        res.render('./Book/Index',{books:allBook})});



// Init Create
router.get('/Create',async (req, res) =>
 {
     try {
         const authors=await author.find({});
         
         res.render('Book/Create',{book:new Book(),authors:authors,errormessage:null});
     } catch (error) {
         res.send("error");
     }
     
 });
router.post('/Create',bookValidation(['Name','Author','PageCount','PublshDate','Description','Title','CoverImageName']), async (req, res) => {
  const errors=validationResult(req);
  const addbook = new Book({
    Name: req.body.Name,
    Author:req.body.Author,
    PageCount:req.body.PageCount,
    PublshDate:new Date(req.body.PublshDate),
    Description:req.body.Description,
    Title:req.body.Title,
    Price:req.body.Price
   

});
  if(errors.isEmpty()){
      
        SaveImageCover(addbook,req.body.CoverImageName);
          const newbook = await addbook.save();
           res.redirect(`/Book/${newbook.id}`);
        // res.redirect('/Book');
  }
     else{

        const authors=await author.find({});
        res.render('Book/Create', {
            book: addbook,
            authors:authors,
            errormessage: errors.array()

        })
     }    
        
 
});
router.get('/:id',async(req,res)=>{const oldBook=await Book.findById(req.params.id).populate('Author').exec(); res.render('Book/Detail',{book:oldBook}); });
router.get('/:id/edit',async(req,res)=>{const oldBook=await Book.findById(req.params.id);const authors=await author.find({}); res.render('Book/Edit', { book: oldBook,authors:authors,errormessage:null });});
router.put('/:id',bookValidation(['Name','Author','PageCount','PublshDate','Description','Title']),async(req,res)=>{
    
        const errors=validationResult(req);
    let oldbook=await Book.findById(req.params.id);
    if(errors.isEmpty()){
        
        oldbook.Name= req.body.Name;
        oldbook.Author=req.body.Author;
        oldbook.PageCount=req.body.PageCount;
        oldbook.PublshDate=new Date(req.body.PublshDate);
        oldbook.Description=req.body.Description;
        oldbook.Title=req.body.Title;
        oldbook.Price=req.body.Price;
        if(req.body.CoverImageName!=null&&req.body.CoverImageName!=''){
                 SaveImageCover(oldbook,req.body.CoverImageName);
        }
        
       await oldbook.save();
       res.redirect(`/Book/${oldbook.id}`);
    }else{
        const authors=await author.find({});
        res.render(`Book/Edit`,{ book: oldbook,authors:authors,errormessage:errors.array() });
    }
   
    
  
   
});
router.delete('/:id',async(req,res)=>{ 
    let oldBook;
    try{
           oldBook=await Book.findById(req.params.id);
          await oldBook.remove();
   res.redirect('/Book');
    }
    catch{
        res.redirect(`/Book/${oldBook.id}`);
    }
 });
function  SaveImageCover(book,encodeCover){
    
    if (encodeCover==null)return;
    const cover=JSON.parse(encodeCover);
    if (cover!=null) {
       
        book.CoverImageName=new Buffer.from(cover.data,'base64');
        book.CoverImageType=cover.type;
    }

}
module.exports = router;