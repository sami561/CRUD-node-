const express = require('express');
const router=express.Router();
const{check}=require('express-validator');
const UsersContoller=require("../controllers/uesr-controller")


router.get('/',UsersContoller.getUsers);
router.post('/signup',[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
],UsersContoller.signup);
router.post('/login',UsersContoller.login);


module.exports=router;