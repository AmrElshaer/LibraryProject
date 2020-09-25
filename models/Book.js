const mongoose=require('mongoose');
const path=require('path');
const coverimagePath="uploads/CoverImage";
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
});
bookschema.virtual('ImagePath').get(function(){
  if (this.CoverImageName!=null) {
      return path.join('/',coverimagePath,this.CoverImageName);
  }


});
module.exports=mongoose.model('Book',bookschema);
module.exports.coverImagePath=coverimagePath;