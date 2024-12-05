const jwt = require('jsonwebtoken')
const { signinSchema } = require('../middlewares/validator')
const { signupSchema } = require('../middlewares/validator')
const User = require('../models/usersModels')
const { doHash, doHashValidation } = require('../utilis/hashing')

exports.signup = async (req, res) => {
const {email, password} = req.body

try {
    const{error, value} = signupSchema.validate({email, password})

    if(error){
        return res.status(401).json({
            success:false, messag: error.details[0].message
        })
    }
    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(401).json({
            success: false, message: 'user exists'
        })
    }

    const hashPassword = await doHash(password, 12)

    const newUser = new User({
        email,
        password:hashPassword,
    })
    const result = await newUser.save()
      result.password = undefined
      res.status(201).json({
        success: true, message: 'account created successfully',
        result
      })
    
} catch (error) {
    console.log(error)
}
}

exports.signin = async (req, res) => {
    const {email, password} = req.body
    try {
        const {error, value} = signinSchema.validate(email, password)

        if(error){
            return res.status(401).json({
                success:false, messag: error.details[0].message
            })
        }

        const existingUser = await User.findOne({email}).select('+password')
        if(!existingUser){
            return res.status(401).json({success: false, message: 'user does not exist'})
        }
        const result = await doHashValidation(password, existingUser.password)

        if(!result){
            return res.status(401).json({
                success: false, message: 'invalid credentials!'
            })
        }
        const token = jwt.sign({
            userID: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified
        },
        process.env.TOKEN_SECRET
    )
    res.cookie('Authorization', 'Bearer' + token, {expires:new Date(Date.now() + 8 * 3600000), httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production'}).json({
        success: true,
        token,
        message: 'logged in successfully',
    })
    } catch (error) {
        console.log(error)
        
    }
}