const express = require('express');
const {body,validationResult}=require('express-validator');
const User=require('../models/User');
const bcrypt=require('bcrypt');
const passport=require('passport');
const router = express.Router();
var RegisterValidation=(params)=> [
    body(params).notEmpty().withMessage('This Field is Required'),
    body('Password').isLength({ min: 5 }),
    body('Email').isEmail().withMessage('You Must Enter Valid Email'),
    
    body('Email').custom(value=>{
        const user=User.find({'Email':value})
        if(user.length>0){
          return false;
        }
        return true;
    }).withMessage("This Email is Exit")

 
    
    ];
var LoginValidation=(params)=>[
  body(params).notEmpty().withMessage('This Field is Required'),
  body('Password').isLength({ min: 5 }),
  body('Email').isEmail().withMessage('You Must Enter Valid Email')
];
router.get('/Register',(req,res)=>{res.render("./Account/Register",{user:new User(),errormessage:null})});
router.post('/Register',RegisterValidation(['Name','AboutYou','CoverImageName','Password','Email']),async(req,res)=>{
var errors=validationResult(req);
const user=new User({
  Name: req.body.Name,
  AboutYou:req.body.AboutYou,
  Email:req.body.Email,
  Password:req.body.Password,

})
if(errors.isEmpty()){
    SaveImageCover(user,req.body.CoverImageName);
    user.Password= await bcrypt.hashSync(user.Password,10);
    await user.save();
    res.redirect('/Account/Login');
}
else{
  res.render('./Account/Register',{user:user,errormessage:errors.array()});
}

});
router.get('/Login',(req,res)=>{res.render("./Account/Login",{user:new User(),errormessage:null})});
function  SaveImageCover(user,encodeCover){
    
    if (encodeCover==null)return;
    const cover=JSON.parse(encodeCover);
    if (cover!=null) {
       
        user.CoverImageName=new Buffer.from(cover.data,'base64');
        user.CoverImageType=cover.type;
    }

}
router.delete('/logout',(req,res)=>{
  req.logOut();
  res.redirect('/Account/Login');
});
router.post('/Login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/Account/Login'
  ,failureFlash:true

}),async(req,res)=>{
  var errors=validationResult(req);
  const user=new User({
    Email:req.body.Email,
    Password:req.body.Password
  
  })
  if(errors.isEmpty()){
    
       
      const userlogin= await User.find({'Email':user.Email,'Password':user.Password});
      if(userlogin!=null){
           res.redirect('/');
      }
      else{
        res.redirect('/Account/Login');
      }
      
  }
  else{
    res.render('./Account/Login',{user:user,errormessage:errors.array()});
  }
  
  });
module.exports = router;