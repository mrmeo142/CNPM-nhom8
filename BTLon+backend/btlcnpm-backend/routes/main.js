const express = require("express");
const router = express.Router();

const food_controller=require("../controllers/foodController");
const catagory_controller=require("../controllers/catagoryController");

//Food Routes


router.get("/food/create",food_controller.create_get);

router.post("/food/create",food_controller.create_post);

router.get("/food/:id/delete",food_controller.delete_get);

router.post("/food/:id/delete",food_controller.delete_post);

router.get("/food/:id/update",food_controller.update_get);

router.post("/food/:id/update",food_controller.update_post);

router.get("/food/:id",food_controller.food_detail);

router.get("/foods",food_controller.food_list);

//Catagory Routes

router.get("/catagory/create",catagory_controller.create_get);

router.post("/catagory/create",catagory_controller.create_post);

router.get("/catagory/:id/delete",catagory_controller.delete_get);

router.post("/catagory/:id/delete",catagory_controller.delete_post);

router.get("/catagory/:id/update",catagory_controller.update_get);

router.post("/catagory/:id/update",catagory_controller.update_post);

router.get("/catagory/:id",catagory_controller.catagory_detail);

router.get("/catagories",catagory_controller.catagory_list);


module.exports=router;
