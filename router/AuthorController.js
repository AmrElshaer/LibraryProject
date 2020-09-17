const express = require('express');
const authors = require('../models/Author');
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

// Edit Author get
router.get('/Authors/Edit',async(req,res)=>{
 try {
     const id=req.query.Id;
     const auth= await author.find({"_id":ObjectId(id)});
     res.send(auth.Name);
 } catch (error) {
     res.render("NotFound/NotFound");
 }
});
// Init Create
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