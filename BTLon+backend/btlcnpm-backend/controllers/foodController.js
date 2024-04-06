const Food=require("../models/food");
const Catagory=require("../models/catagory");

const asyncHandler=require("express-async-handler");

const {body,validationResult}=require("express-validator");

exports.food_list=asyncHandler(async(req,res,next)=>{
    const allFoods =await Food.find({},"name price priceUnit").sort({name:1}).exec();

    res.render("food_list",{
        title:"Menu",
        food_list:allFoods,
    })
})

exports.food_detail=asyncHandler(async(req,res,next)=>{
    //Find the food
    const foodDetail= await Food.findById(req.params.id).populate("catagory").exec();

    if(foodDetail==null)
    {
        const err=new Error("Menu item not found");
        err.status=404;
        return next(err);
    }
    
    res.render("food_detail",{
        title:"Food Detail",
        food:foodDetail,
    })
});

exports.create_get=asyncHandler(async(req,res,next)=>{
    const allCatagories =await Catagory.find().sort({ name: 1 }).exec();


    res.render("food_form", {
        title: "Create food on the menu",
        catagories:allCatagories,
    });
});

exports.create_post=[
     // Convert the catagory to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.catagory)) {
      req.body.catagory =
        typeof req.body.catagory === "undefined" ? [] : [req.body.catagory];
    }
    next();
  },
    body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .isInt()
    .escape(),
    body("priceUnit", "Price unit must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("catagory.*")
    .escape(),
    asyncHandler(async(req,res,next)=>{
        const errors=validationResult(req);

        const food=new Food({
            name:req.body.name,
            price:req.body.price,
            priceUnit:req.body.priceUnit,
            catagory:req.body.catagory,
            description:req.body.description,
        });

        if(!errors.isEmpty())
        {
            const allCatagories =await Catagory.find().sort({ name: 1 }).exec();
            // Mark our selected catagory as checked.
            for(const catagory of allCatagories)
            {
                if(food.catagory.indexOf(catagory._id)>-1){
                    catagory.checked="true";
                }
            }
            
            res.render("food_form", {
                title: "Create a menu item",
                food:  food,
                catagories: allCatagories,
                errors: errors.array(),
            });
        }
        else{
            // Xem food đã có chưa
            const foodExist=await Food.findOne({name:req.body.name}).exec();

            if(foodExist)
            {
                res.redirect(foodExist.url);
            }
            else{
                
            await food.save();
            res.redirect(food.url);
                }
        }
    }),
];

exports.delete_get=asyncHandler(async(req,res,next)=>{
    const food=await Food.findById(req.params.id).exec();

    if(food===null)
    {
        res.redirect("/main/foods");
    }
    
    res.render("food_delete",{
        title: "Delete item on the menu",
        food: food,
    })
})

exports.delete_post=asyncHandler(async(req,res,next)=>{
    const food=await Food.findById(req.params.id).exec();

    await Food.findByIdAndDelete(req.body.foodid);
    res.redirect("/main/foods");

})

exports.update_get=asyncHandler(async(req,res,next)=>{
    const [food, allCatagories]=await Promise.all([
        Food.findById(req.params.id).exec(),
        Catagory.find().sort({name:1}).exec(),
    ]);

    if(food===null)
    {
        const err=new Error("Food not found");
        err.status=404;
        return next(err);
    }

    allCatagories.forEach((catagory)=>{
        if(food.catagory.includes(catagory._id)) catagory.checked="true";
    });

    res.render("food_form",{
        title: "Update food",
        catagories:allCatagories,
        food:food,
    });

})

exports.update_post=[
     // Convert the catagory to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.catagory)) {
      req.body.catagory =
        typeof req.body.catagory === "undefined" ? [] : [req.body.catagory];
    }
    next();
  },
    body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .isInt()
    .escape(),
    body("priceUnit", "Price unit must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("catagory.*")
    .escape(),
    asyncHandler(async(req,res,next)=>{
        const errors=validationResult(req);

        const food=new Food({
            name:req.body.name,
            price:req.body.price,
            priceUnit:req.body.priceUnit,
            catagory:typeof req.body.catagory === "undefined" ? [] : req.body.catagory,
            description:req.body.description,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if(!errors.isEmpty())
        {
            const allCatagories =await Catagory.find().sort({ name: 1 }).exec();
            // Mark our selected catagory as checked.
            allCatagories.forEach((catagory)=>{
                if(food.catagory.includes(catagory._id)) catagory.checked="true";
            });
            
            res.render("food_form", {
                title: "Update a menu item",
                food:  food,
                catagories: allCatagories,
                errors: errors.array(),
            });
            return;
        } else {
            // Data form is valid:
            const updatedFood=await Food.findByIdAndUpdate(req.params.id, food,{});

            res.redirect(updatedFood.url);
        }
    }),
]

