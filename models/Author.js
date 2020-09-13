const mongoose=require('mongoose');
const authorsschema=new mongoose.Schema({
Name:{

    type:String,
    required:true
}

});
module.exports=mongoose.model('Author',authorsschema);