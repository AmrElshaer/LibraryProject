const mongoose=require('mongoose');
const Book=require('./Book');
const authorsschema=new mongoose.Schema({
Name:{

    type:String,
    required:true
}
    ,
CoverImageName:{
    type:Buffer,
    required:true
},
CoverImageType:{
    type:String,
    required:true
},Description:{
    type:String,
    required:true
}


});
authorsschema.virtual('ImagePath').get(function(){
    if (this.CoverImageName!=null) {
        /* path.join('/',coverimagePath,this.CoverImageName); */
  
        return `data:${this.CoverImageType};charset=utf-8;base64,${this.CoverImageName.toString('base64')}`;
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