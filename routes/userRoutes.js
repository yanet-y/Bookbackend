import express from 'express'
import { User } from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const signUser = (id)=>{
    return jwt.sign({_id:id},process.env.SECRET,{expiresIn:'3d'})
}

const router = express.Router()

// router to sign up a user

router.post('/signup',async(req,res)=>{
    const {username,password,email} = req.body

    if (!username&&!email&!password){
        return res.status(401).json({error:"Please fill out all fields"})
    }

    try {
        const isthere = await User.findOne({email})

        if (isthere){
            return res.status(401).json({error:"User already exists by this email"})
        }

        const hashpass = await bcrypt.hash(password,8)
        const user = await User.create({username,password:hashpass,email})
        const token = signUser(user._id)
        res.status(200).json({user,token})
        
    } catch (error) {
        res.status(401).json({error:error})
    }
})

router.post('/login',async(req,res)=>{
    const {password,email} = req.body

    if (!email&!password){
        return res.status(401).json({error:"Please fill out all fields"})
    }

    try {

        const user = await User.findOne({email})
        const pass_matches = await bcrypt.compare(password,user.password)
        if (!pass_matches){
            return res.status(401).json({error:"Password not match"})
        }
        const token = signUser(user._id)
        res.status(200).json({user,token})
        
    } catch (error) {
        res.status(401).json({error:error})
    }
})

export default router