const express = require('express');
const author=require('../models/Author');
const Book = require('../models/Book');
const router = express.Router();
const path=require('path');
const Author = require('../models/Author');
const { isNullOrUndefined } = require('util');
/* const uploadpath=path.join('public',Book.coverImagePath); */
const imageMimeTypes=['image/png','image/jpg'];
/* const upload=multer({
    dest:uploadpath
   
}); */
//Get All Book
router.get('/',async (req, res) => { 
    
    let query=Book.find();
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
         
         res.render('Book/Create',{book:new Book(),authors:authors});
     } catch (error) {
         res.send("error");
     }
     
 });
router.post('/Create', async (req, res) => {
  
          const addbook = new Book({
            Name: req.body.Name,
            Author:req.body.Author,
            PageCount:req.body.PageCount,
            PublshDate:new Date(req.body.PublshDate),
            Description:req.body.Description,
            Title:req.body.Title
           
    
        });
        SaveImageCover(addbook,req.body.CoverImageName);
    try {
        
          const newbook = await addbook.save();
          //  res.redirect(`/${newauthor.id}`);
         res.redirect('/Book');
    }catch (error) {
        const authors=await author.find({});
        res.render('Book/Create', {
            book: addbook,
            authors:authors,
            errormessage: 'Error when Create Book'

        })
        
    }

});
router.get('/:id',async(req,res)=>{const oldBook=await Book.findById(req.params.id).populate('Author').exec(); res.render('Book/Detail',{book:oldBook}); });
router.get('/:id/edit',async(req,res)=>{const oldBook=await Book.findById(req.params.id);const authors=await author.find({}); res.render('Book/Edit', { book: oldBook,authors:authors });});
router.put('/:id',async(req,res)=>{
    try {
         let oldbook=await Book.findById(req.params.id);
    oldbook.Name= req.body.Name;
    oldbook.Author=req.body.Author;
    oldbook.PageCount=req.body.PageCount;
    oldbook.PublshDate=new Date(req.body.PublshDate);
    oldbook.Description=req.body.Description;
    oldbook.Title=req.body.Title;
    if(req.body.CoverImageName!=null&&req.body.CoverImageName!=''){
             SaveImageCover(oldbook,req.body.CoverImageName);
    }
    
   await oldbook.save();
   res.redirect(`/Book/${oldbook.id}`);
    } catch (error) {
        res.redirect('/Book');
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