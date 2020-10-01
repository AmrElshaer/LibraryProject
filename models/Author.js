const mongoose=require('mongoose');
const Book=require('./Book');
const authorsschema=new mongoose.Schema({
Name:{

    type:String,
    required:true
}

});
authorsschema.pre('remove',function(next){
    Book.find({Author:this.id},(err,books)=>{
        if(err){
            next(err);
        }else if(books.length>0){
                next(new Error('This Author has books still'));

        }
        else{
            //Contunie without error
            next();
        }
    });
});
module.exports=mongoose.model('Author',authorsschema);