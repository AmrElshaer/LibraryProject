const express = require('express');
const author=require('../models/Author');
const Book = require('../models/Book');
const router = express.Router();
const path=require('path');
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

// Edit Author get
router.get('/Edit',async(req,res)=>{
 try {
     const id=req.query.Id;
     const auth= await author.find({"_id":ObjectId(id)});
     res.send(auth.Name);
 } catch (error) {
     res.render("NotFound/NotFound");
 }
});
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
function  SaveImageCover(book,encodeCover){
    
    if (encodeCover==null)return;
    const cover=JSON.parse(encodeCover);
    if (cover!=null) {
       
        book.CoverImageName=new Buffer.from(cover.data,'base64');
        book.CoverImageType=cover.type;
    }

}
module.exports = router;