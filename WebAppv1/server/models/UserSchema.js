const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require("validator")

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
//staticlogin method
UserSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})
    if(!user){
        throw Error("Incorrect email")
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error("Incorrect password")
    }

    return user
}

// static signup method - cant use arrow function becuase of this
UserSchema.statics.signup = async function(email, password){
    //validation
    // Check if the email or the password is empty
    if(!email || !password){
        throw Error('All fields must be filled')
    }
    // Check if the email is valid using the validator package
    if(!validator.isEmail(email)){
        throw Error("Emailis not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Password not strong enough")
    }

    //Check if the email already exists
    const exists = await this.findOne({email})
    if(exists){
        throw Error("Email already in use")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password:hash})
    return user
}

module.exports = mongoose.model('User', UserSchema);