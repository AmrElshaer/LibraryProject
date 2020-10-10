const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
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
},AboutYou:{
    type:String,
    required:true
},
Email:{
    type:String
    ,required:true,
    
}
,Password:{
    type:String,
    required:true
}

});
userschema.virtual('ImagePath').get(function(){
    if (this.CoverImageName!=null) {
        /* path.join('/',coverimagePath,this.CoverImageName); */
  
        return `data:${this.CoverImageType};charset=utf-8;base64,${this.CoverImageName.toString('base64')}`;
    }
  
  
  });

module.exports=mongoose.model('User',userschema);