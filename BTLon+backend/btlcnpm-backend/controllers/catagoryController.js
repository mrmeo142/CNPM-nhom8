const Catagory=require("../models/catagory");
const Food=require("../models/food");
const asyncHandler=require("express-async-handler");

const {body,validationResult}=require("express-validator");

exports.catagory_list=asyncHandler(async(req,res,next)=>{
    const allcatagorys =await Catagory.find({},"name").sort({name:1}).exec();

    res.render("catagory_list",{
        title:"catagory List",
        catagory_list:allcatagorys,
    })
})

exports.catagory_detail=asyncHandler(async(req,res,next)=>{
    //Find the catagory
    const [catagoryDetail,allFoodWithCatagory]= await Promise.all([
        Catagory.findById(req.params.id).exec(),
        Food.find({catagory:req.params.id},"name").exec(),
    ])

    if(catagoryDetail==null)
    {
        const err=new Error("Catagory not found");
        err.status=404;
        return next(err);
    }
    
    res.render("catagory_detail",{
        title:"catagory Detail",
        catagory:catagoryDetail,
        allFoodWithCatagory:allFoodWithCatagory,
    })
});

exports.create_get=asyncHandler(async(req,res,next)=>{
    res.render("catagory_form", {title: "Create catagory on the menu"});
});

exports.create_post=[
    body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    asyncHandler(async(req,res,next)=>{
        const errors=validationResult(req);

        const catagory=new Catagory({
            name:req.body.name,
        });

        if(!errors.isEmpty())
        {
            res.render("catagory_form", {
                title: "Create a menu catagory",
                catagory:  catagory,
                errors: errors.array(),
            });
        }
        else{
            // Xem catagory đã có chưa
            const catagoryExist=await Catagory.findOne({name:req.body.name}).exec();

            if(catagoryExist)
            {
                res.redirect(catagoryExist.url);
            }
            else{
                
            await catagory.save();
            res.redirect(catagory.url);
                }
        }
    }),
];

exports.delete_get=asyncHandler(async(req,res,next)=>{
    const [catagory, allFoodWithCatagory]=await Promise.all([
        Catagory.findById(req.params.id).exec(),
        Food.find( {catagory: req.params.id}, "name").exec(),
    ])
    if(catagory===null)
    {
        res.redirect("/main/catagorys");
    }
    
    res.render("catagory_delete",{
        title: "Delete catagory on the menu",
        catagory: catagory,
        foodWithCatagory: allFoodWithCatagory,
    })
})

exports.delete_post=asyncHandler(async(req,res,next)=>{
    const [catagory, allFoodWithCatagory]=await Promise.all([
        Catagory.findById(req.params.id).exec(),
        Food.find( {catagory: req.params.id}, "name").exec(),
    ])

    if(allFoodWithCatagory.length>0)
    {
        //Catagory has foods. Delete them first 
        res.render("catagory_delete",{
            title: "Delete Catagory",
            catagory:catagory,
            foodWithCatagory:allFoodWithCatagory,
        });
        return;
    } else {
    await Catagory.findByIdAndDelete(req.body.catagoryid);
    res.redirect("/main/catagories");
    }
})

exports.update_get=asyncHandler(async(req,res,next)=>{
    //Check if it exists
    const catagory= await Catagory.findById(req.params.id).exec();
    if(catagory===null)
    {
        const err=new Error;
        err.status=404;
        return next(err);
    }

    res.render("catagory_form", {title: "Update catagory on the menu", catagory:catagory});
})

exports.update_post=[
    body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    asyncHandler(async(req,res,next)=>{
        const errors=validationResult(req);

        const catagory=new Catagory({
            name:req.body.name,
            _id:req.params.id,
        });

        if(!errors.isEmpty())
        {
            res.render("catagory_form", {
                title: "Update a menu catagory",
                catagory:  catagory,
                errors: errors.array(),
            });
        }
        else{
            await Catagory.findByIdAndUpdate(req.params.id,catagory);
            res.redirect(catagory.url);
            }
    }),
];