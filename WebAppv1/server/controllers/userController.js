const User = require("../models/UserSchema")
const jwt =  require("jsonwebtoken")

const createToken = (_id)=>{
    // Pass in the MongoUserID and set the expiration to one day
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: "5d"})
}

// login user
const loginUser = async(req, res)=>{
    const {email, password} = req.body
    try{
        const user = await User.login(email, password)
        // Create a token
        const token = createToken(user._id)
        res.status(200).json({email, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async(req, res)=>{
    const {email, password} = req.body
    try{
        const user = await User.signup(email, password)
        // Create a token
        const token = createToken(user._id)
        res.status(200).json({email, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}


module.exports = {
    loginUser,
    signupUser
}