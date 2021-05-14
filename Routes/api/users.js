const express = require("express")

const router =express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const keys = require('../../config/keys')

const validateRegisterInput = require("../../Validation/register")
const validateLoginInput = require("../../Validation/login")

const User = require("../../models/User")

router.post("/register",(req,res)=>{
    const {error , isValid} = validateRegisterInput(req.body)
    if(!isValid)
    {
        return res.status(400).json(error)
    }
    User.findOne({email:req.body.email}).then(user =>{
        if(user)
        return res.status(400).json({failure:"Email already exists"})
        else{
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            })
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err)
                    throw err
                    newUser.password = hash
                    newUser.save()
                           .then(user => res.json({user,success:"User successfully registered!"}))
                           .catch(err => console.log(err))
                })
            })
        }
    })
})

router.post('/login',(req,res)=>{
    const {errors,isValid} = validateLoginInput(req.body)
    if(!isValid)
    return res.status(400).json(errors)
    const email = req.body.email
    const password = req.body.password
    User.findOne({email}).then(user =>{
        if(!user)
        return res.send(404).json({failure:"Email Not Found"})
        bcrypt.compare(password,user.password).then(isMatch =>{
            if(isMatch)
            {
                const payload = {
                    id:user.id,
                    name:user.name
                }
                jwt.sign(payload,keys.secretOrKey,
                    {
                        expiresIn:31556926
                    },
                    (err,token)=>{
                        res.json({
                            success:true,
                            token:"Bearer " + token,
                            name:user.name,
                            email:user.email
                        })
                    })
            }
            else{
                return res.status(400).json({failure:"Password Incorrect"})
            }
        })
    }).catch(error=>{
        return res.status(400).json({failure:"User not registered!"})
    })



})

router.post("/home",(req,res)=>{
    const token = req.headers["token"]
    if(token == 'NULL')
    res.status(400).json({
       sucess:false,
       message:"Unauthorized Access" 
    })
    else
    {
        

    }
})

module.exports = router
