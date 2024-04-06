const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const catagorySchema=new Schema({
    name: {type: String,min: 3,required: true},
})

//Virtual for url
catagorySchema.virtual('url').get(function(){
    return `/main/catagory/${this._id}`;
})

module.exports=mongoose.model("Catagory",catagorySchema);