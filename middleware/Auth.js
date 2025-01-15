import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

const requireAuth = async (req,res,next)=>{

    const {authorization} = req.headers
    
    console.log(authorization)

    if (!authorization){
        return res.status(401).json({error:"Authorization token required"})
    }

    const token = authorization.split(' ')[1]

    try {

        const{_id} = await jwt.verify(token,process.env.SECRET)

        req.id = await User.findOne({_id}).select('_id')

        next()
        
    } catch (error) {
        return res.status(401).json({error:"Not Authorized"})
    }
}

export const Auth = requireAuth