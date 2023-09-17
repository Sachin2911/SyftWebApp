const jwt = require("jsonwebtoken")
const User = require("../models/UserSchema")

const requireAuth = async(req, res, next) =>{

    //verify authentication
    const { authorization } = req.headers
    
    if(!authorization){
        return res.status(401).json({error:"Authorization token required!!"})
    }
    //'Bearer dhsfhgsdkfkjsdbf.dsfgksdgfsd.uksgdhfuksdgfs' -> this is how it will look we need to split
    const token = authorization.split(' ')[1]
    try{
        // Try and verify the token
        const {_id} = jwt.verify(token, process.env.SECRET)
        //find the user in the db, attaching the user
        req.user = await User.findOne({ _id }).select("_id")
        next()

    }catch(error){
        console.log(error)
        res.status(401).json({error:"Request is not authorized!!"})
    }

    
}

module.exports = requireAuth