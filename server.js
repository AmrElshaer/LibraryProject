if (process.env.Node_ENV!='production') {
    require('dotenv').config();
}
const Users=require('./models/User');
const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const authorrouter=require('./router/AuthorController');
const bookrouter=require('./router/BookController');
const homerouter=require('./router/HomeController');
const accountrouter=require('./router/AccountController');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const methodoverride=require('method-override');
const passport=require('passport');
const flash=require('express-flash');
const session=require('express-session');
const initializePassport=require('./passport-config');
const User = require('./models/User');
initializePassport(passport,async (email)=>{
return await Users.findOne({Email:email});
},async(id)=>{return await Users.findById(id);});
const app=express();

//Database connection
mongoose.connect(process.env.DatabaseUrl,{useNewUrlParser:true,useUnifiedTopology:true});
const db=mongoose.connection;
db.on('error',(err)=>console.error(err));
app.use(express.static('public'));
db.once('open',()=>console.log('connect'));
app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.set('layout','layouts/layout');
app.use(expressLayouts);
app.use(methodoverride('_method'));
app.use(bodyparser.urlencoded({limit:'10mb',extended:false}) );
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    app.locals.User=req.user;
    next();
});
app.use('/Account',accountrouter);
app.use('/Author',authorrouter);
app.use('/Book',bookrouter);
app.use('/',homerouter);
app.listen(process.env.PORT||3000);