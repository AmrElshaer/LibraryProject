const mongoose=require('mongoose');
const bookschema=new mongoose.Schema({
Name:{

    type:String,
    required:true
},
Title:{

    type:String,
    required:true
},
CreatedAt:{
    type:Date,
    required:true,
    default:Date.now
},
CoverImageName:{
    type:Buffer,
    required:true
},
CoverImageType:{
    type:String,
    required:true
},
Author:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Author'
},
PageCount:{
    type:Number,
    required:true
},
PublshDate:{
    type:Date,
    required:true
},
Description:{
    type:String,
    required:true
}
,
Price:{
    type:Number,
    required:true
}
});
bookschema.virtual('ImagePath').get(function(){
  if (this.CoverImageName!=null) {
      /* path.join('/',coverimagePath,this.CoverImageName); */

      return `data:${this.CoverImageType};charset=utf-8;base64,${this.CoverImageName.toString('base64')}`;
  }


});
module.exports=mongoose.model('Book',bookschema);