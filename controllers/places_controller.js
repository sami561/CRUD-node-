const HttpError =require('../models/http-error');
const uuid= require('uuid');
const {validationResult}= require('express-validator')
const Place=require("../models/places");
const User=require('../models/user');

const mongoose=require('mongoose');
const places = require('../models/places');


// let DUMMY_PLACES = [
//     {
//       id: 'p1',
//       title: 'Empire State Building',
//       description: 'One of the most famous sky scrapers in the world!',
//       location: {
//         lat: 40.7484474,
//         lng: -73.9871516
//       },
//       address: '20 W 34th St, New York, NY 10001',
//       creator: 'u1'
//     }
//   ];


//////////////////////////////////////////////////           getPlaceById /////////////////////////////////////////////////////////////////////////////////////////////////

const getPlaceById=async(req,res,next)=>
{
    const placeId=req.params.pid;//{pid:'p1}
    let place;
try{
   place= await Place.findById(placeId); // const place=DUMMY_PLACES.find(p=>{
    //     return p.id===placeId;
    // })
    console.log('Get Request in Places');
    res.json({place});//{place}={place:place}
}catch{  
    let error = new HttpError(err);
    return next(error);
}
    if(!place){
        // const error=new Error('Could not find a place for the provided test id.');
        // error.code=404;
      const error= new HttpError('Could not find a place for the provided  test id.',404);
    //    return res.status(404).json({message:'could not find a place foe the Provided id ! '});
    return next(error);
    }

    
   
} ;
 //////////////////////////////////////////////////////////           getUserById         ///////////////////////////////////////////////////////////////////////////////////
 const getUserById= async(req,res,next)=>{
    const userid=req.params.uid;
    let userWithPlace;
    try{
        userWithPlace=await User.findById(userid).populate('places');
        

    }
    catch(err){let error = new HttpError(err);
        return next(error);
           
    }
    if(!userWithPlace||userWithPlac.places.length===0){
        // const error=new HttpError('Could not find a place for the provided user test id.');
        // error.code=404;
        return next( new HttpError(err));
        // return res.status(404).json({message:'could not find a place foe the Provided user id ! '});
     }
     res.json({places:userWithPlace.places.map(place=>place.toObject({getters:true}))});

}
//////////////////////////////////////////////////////////////////////////       createPlace         ///////////////////////////////////////////////////////////////////////////////////
const createPlace=async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
 const {title,description,location,address,creator}= req.body;
 const createdPlace = new Place({
    title,
    description,
    address,
    location,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator
  });
  let user;
  try{ user=await User.findById(creator);

  }
  catch(err){
 let error =new HttpError('creating place failed ,please try again',500);
 return next(error);
  }
  if(!user){
    let error =new HttpError('could not find user for provided id',404);
    return next(error);
  }
  console.log(user);

  try {
     const sess=await mongoose.startSession();
     sess.startTransaction();
    const result= await createdPlace.save({session:sess});
        user.places.push(createdPlace) ;
        await user.save({session:sess});
        await sess.commitTransaction();
    // const result=await createdPlace.save();
    res.status(201).json({place:result});
   
  } catch (err) {
    const error = new HttpError(err
    );
    return next(error);
  }

  
  
//  DUMMY_PLACES.push(createdPlace);

};
////////////////////////////////////////////////////////////////////////////////////////// update Place ////////////////////////////////////////////////////////////////////////////////////
const UpdatePlace=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       console.log(errors);
        res.status(402);
        let error= new HttpError(errors);
        return next(error)
    }
    const {title,description}= req.body;
    const placeId=req.params.pid;
    let place;
    try{
     place = await Place.findById(placeId);
    }catch(err){
        let error= new HttpError(err);
        return next(error)

    }
    

//  const updatedPlace={...DUMMY_PLACES.find(p=>p.id===placeId)};
//  const placeIndex=DUMMY_PLACES.findIndex(p=>p.id===placeId);
 place.title=title;
place.description=description;
   try{
    await place.save();
    
    
   }
   catch(err){
    let error= new HttpError(err);
    return next(error)

   }

//   DUMMY_PLACES[placeIndex]=updatedPlace;
res.status(200).json({place:place.toObject({getters:true})});
 
};



 ////////////////////////////////////////////////////////Delete Place//////////////////////////////////
const DeletePlace=async(req,res,next)=>{

    const placeId =req.params.pid;
    let place;
    try{
        place=await (await Place.findById(placeId)).populate('creator');
       


    }catch(err){
        let error=new HttpError(err);
        return next(error);

    }
    if(!place){
        let error=new HttpError('could not found the place ',404);
        return next(error);

    }
    try{
        const sess=await mongoose.startSession();
     sess.startTransaction();
      await place.remove({session:sess});
     place.creator.places.pull(place);
     await place.creator.save({session:sess});
     await sess.commitTransaction();
        }catch(err){
        let error=new HttpError(err);
        return next(error);

    }
    // if(!DUMMY_PLACES.find(p => p.id === placeId)){
    //     throw new HttpError('could not a place for that id .',404);
    // }
    // DUMMY_PLACES=DUMMY_PLACES.filter(p=>p.id !== placeId);
    res.status(200).json({message:"Deleted Place"});
};



exports.getPlaceById=getPlaceById;
exports.getUserById=getUserById;
exports.createPlace=createPlace;
exports.UpdatePlace=UpdatePlace;
exports.DeletePlace=DeletePlace;