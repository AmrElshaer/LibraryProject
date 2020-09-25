if (process.env.Node_ENV!='production') {
    require('dotenv').config();
}
const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const authorrouter=require('./router/AuthorController');
const bookrouter=require('./router/BookController');
const homerouter=require('./router/HomeController');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const app=express();
console.log();
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

app.use(bodyparser.urlencoded({limit:'10mb',extended:false}) );
//add Index middleware
app.use('/Author',authorrouter);
app.use('/Book',bookrouter);
app.use('/',homerouter);
app.listen(process.env.PORT||3000);