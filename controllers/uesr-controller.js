// const uuid= require('uuid');
const HttpError =require('../models/http-error');
const {validationResult}= require('express-validator')
const User=require('../models/user')
const Place=require('../models/places');



// const DUMMY_USERS=[
//     {
//         id:'u1',
//         name:'Max Schwarz',
//         email:'test@test.com',
//         password:'testers'

//     }
// ] 

/////////////////////////////////////////////////     get Users               / ////////////////////////////////////////////////////////////////////////////////////////
const getUsers=async(req,res,next)=>{
    let users;
    try{
      users=await User.find({},'-password');

}catch(err){
    let error=new HttpError(err)
    return next(error);

}
res.json({users:users.map(user => user.toObject({geters:true}))});

};
/////////////////////////////////////////////////    signup           / ////////////////////////////////////////////////////////////////////////////////////////

const signup=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        res.status(422);
        return next (new HttpError('Invalid inputs passed ,please check your data',422)
         ) }
    const {name,email,password}=req.body;
    let uniqueUser;
    try{
        uniqueUser=await User.findOne({email:email});
    }catch(err){
       let error=new HttpError(err);
       return next(error);
    }
    if(uniqueUser){
        let error=new HttpError('user exists already ,please login insted',422);
        return next(error);
    }
    // const hasUser=DUMMY_USERS.find(u=>u.email===email);
    // if(hasUser){
    //     throw new HttpError('Could not create user , email already exists ',422);
    // }
    const createdUser= new User({
        
        name,
        email,
        image:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
        password,
        places:[],

    });
    try {
        const result=await createdUser.save();
        res.status(201).json({user:result.toObject({getters:true})});
      } catch (err) {
        const error = new HttpError(err
        );
        return next(error);
      }
    // DUMMY_USERS.push(createdUser);
   
  

};
/////////////////////////////////////////////////   login          / ////////////////////////////////////////////////////////////////////////////////////////

const login =async(req,res,next)=>{
    const {email,password}=req.body;
    let uniqueUser;
    try{
        uniqueUser=await User.findOne({email:email});
    }catch(err){
       let error=new HttpError(err);
       return next(error);
    }
   
//     const identifiedUser=DUMMY_USERS.find(u=>u.email===email);
//     if(!identifiedUser || identifiedUser.password!==password){

// throw new HttpError('Could not identify user,credentials seem to be wrong ',401);

//     }*
if(!uniqueUser||uniqueUser.password !== password){
   let error= new HttpError('Invalid credentials ,could not log you in ',401);
   return next(error);
}
   res.json({message:'logged in!'});

   
};
exports.getUsers=getUsers;
exports.signup=signup;
exports.login=login;