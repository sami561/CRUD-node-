const express = require('express');
const {check}=require("express-validator");
const router=express.Router();

const placesControllers=require("../controllers/places_controller")


router.get('/:pid',placesControllers.getPlaceById);
router.get('/user/:uid',placesControllers.getUserById);
router.post('/',[
check('title')
.not()
.isEmpty(),
check('description')
.isLength({min:5}),
check('address').not().isEmpty()
]
,placesControllers.createPlace);
router.patch("/:pid",[check('title')
.not()
.isEmpty(),
check('description')
.isLength({min:5})],placesControllers.UpdatePlace);

router.delete("/:pid",placesControllers.DeletePlace);

module.exports=router;