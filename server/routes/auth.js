const express = require('express');
const Signup_User = require('../models/signup_user');

// for signin api endpoint
const jwt = require('jsonwebtoken'); 

// password hashing **
const bcrypt = require('bcryptjs');
//const { hasSubscribers } = require('node:diagnostics_channel');

const authRouter = express.Router();

authRouter.post('/api/signup',async(req,res)=>{
    try{
        const {fullName, password, confirm_password} = req.body;
        const email = (req.body.email || "").trim().toLowerCase();
       if (password !== confirm_password) {
  return res.status(400).json({ msg: "Passwords do not match" });
} 
if (!password || password.length < 8) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters"
      });
    }
        const existingEmail = await Signup_User.findOne({email});

        if(existingEmail){
            return res.status(400).json({msg:"User already exist!"});
        }else{
            // creating random string with salt for password hash
                const salt = await bcrypt.genSalt(10);
                const hashed_password = await bcrypt.hash(password,salt);

            let new_user = new Signup_User ({fullName, email, password:hashed_password}); 
            new_user = await new_user.save();
            const {password: savedPassword, ...userExceptPassword} = new_user._doc;
            res.status(201).json({
  msg: "Signup successful",
  user: userExceptPassword
});
        }
    } catch (e){
        res.status(500).json({error:e.message});
    }
});

// Sign_in Api endpoint

authRouter.post('/api/signin', async(req,res)=>{
    try{
        const email = (req.body.email || "").trim().toLowerCase();
        const {password} = req.body;
      const findUser =  await Signup_User.findOne({email});
      if(!findUser){
        return res.status(400).json({msg:"User not found with this email"});
      } else{
        const isMatch = await bcrypt.compare(password, findUser.password);
        if(!isMatch){
            return res.status(400).json({msg:"Incorrect Password!"});
        } else{
            const token = jwt.sign({id: findUser._id}, process.env.JWT_SECRET, { expiresIn: "7d" });

            //I exclude password return to user - extract password and out from the document
            const{password ,...userExceptPassword} = findUser._doc;
            // send the response
            res.json({token, user: userExceptPassword, ...userExceptPassword});
        }
      }

    }catch (err){
    res.status(500).json({ error: err.message });
    }
});

module.exports = authRouter;
