const mongoose = require ('mongoose');

const signup_userSchema = mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        validate:{
            validator: (value)=>{
                const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return result.test(value);
            },
            message : "Please Enter a valid email address",
        }
    },
    password:{
        type: String,
        required: true,
        validate: {
            validator: (value)=>{
                // Check length of password minimum 8 chrs
                return value.length >=8;
            },
            message: "Password must be 8 chrs minimum",
        }
    },
    /* confirm_password:{
        type: String,
        required: true,
        validate:{
            validator:(value)=>{
                // check password and confirm password are match
                if (req.body.password !== req.body.confirm_password) {
    return res.status(400).json({
        message: "Passwords do not match"
    });
}
            }}
            }, */
        });

const Signup_User = mongoose.model("Signup_User", signup_userSchema,"users");

module.exports = Signup_User;