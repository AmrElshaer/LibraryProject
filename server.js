if (process.env.Node_ENV!='production') {
    require('dotenv').config();
}
const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const indexrouter=require('./router/AuthorController');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const app=express();
console.log();
//Database connection
mongoose.connect(process.env.DatabaseUrl,{useNewUrlParser:true});
const db=mongoose.connection;
db.on('error',(err)=>console.error(err));
db.once('open',()=>console.log('connect'));
app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.set('layout','layouts/layout');
app.use(expressLayouts);
app.set(express.static('public'));
app.use(bodyparser.urlencoded({limit:'10mb',extended:false}) );
//add Index middleware
app.use('/',indexrouter);
app.listen(process.env.PORT||3000);