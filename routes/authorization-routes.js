const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult}= require('express-validator')
const Users= require('../models/Users')
const bcrypt = require('bcrypt')

const router = Router()

// /api/auth/register
router.post('/register',[
        check('email','Email should be in format!').isEmail(),
        check('password','Password should contain at least 8 characters!').isLength({min:8}),
        check('first_name','First name should be filled!').isLength({min:2,max:20}),
        check('last_name','Last name should be filled!').isLength({min:2,max:20})
    ],
    async (req,res)=>{
        try{
            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors:errors.array(),
                    message:'Invalid registration information.'
                })
            }

            const {email,password, first_name,last_name}=req.body

            const potential = await Users.findOne({email})

            if(potential){
                return res.status(400).json({message: 'This email is already taken!'})
            }
            const hashed = await bcrypt.hash(password,12)

            const newUser = new Users({email,first_name,last_name,password:hashed})

            await newUser.save()

            res.status(201).json({message:'User created successfully!'})

        }catch (e){
            console.error(e.message)
            res.status(500).json({message:'Something went wrong, please try again...'})
        }
    })

// /api/auth/login
router.post('/login',
    [
        check('email','Enter correct email!').isEmail(),
        check('password','Enter password').exists()
    ],
    async (req,res)=>{
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid login information!'
                })
            }

            const {email, password} = req.body

            const user = await Users.findOne({email})

            if(!user){
                return res.status(400).json({message:'Incorrect email or password!'})
            }
            const isValid = await bcrypt.compare(password,user.password)

            if(!isValid){
                return res.status(400).json({message:'Incorrect email or password!'})
            }

            const token = jwt.sign(
                {userId:user.id},
                config.get('jwt'),
                {expiresIn: '1h'}
            )

            res.json({token,userId: user.id})
        }catch (e){
            res.status(500).json({message:'Something went wrong, please try again...'})
        }})

// /api/auth/info
router.post('/info',async(req,res)=>{
    try{
        const {first_name,last_name} = await Users.findOne({_id:req.body.userId},'first_name last_name')

        res.status(200).json({name:`${first_name} ${last_name}`})

    }catch (e){
        res.status(500).json({message:'Unable get user info'})
    }
})
module.exports = router