const mongoose=require("mongoose");
const catagory = require("./catagory");

const Schema=mongoose.Schema;

const foodSchema=new Schema({
    name: {type: String,min: 3,required: true},
    price: {type: Number,min: 0,required: true},
    priceUnit: {type: String,min: 3,required: true},
    catagory: [{ type: Schema.Types.ObjectId, ref: "Catagory" }],
    description: { type: String, required: true },
})

//Virtual for url
foodSchema.virtual('url').get(function(){
    return `/main/food/${this._id}`;
})

module.exports=mongoose.model("Food",foodSchema);

