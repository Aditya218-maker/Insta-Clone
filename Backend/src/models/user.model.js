const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
         type: String,
        unique: [ true, "user already exists" ],
        required : [true, "Username is required"]
    },
    email: {
        type: String,
        unique: [ true, "With this email user account already exists" ],
        required : [true, "Email is required"]
    },
    password: {
        type: String,
        required : [true, "Password is required"]
    },
    bio: String,
    profileImage:{
        type:String,
        default: "https://ik.imagekit.io/iais2duys/defaultIGpp.avif?updatedAt=1776137694088"
    }
})

const userModel = mongoose.model("users", userSchema)


module.exports = userModel