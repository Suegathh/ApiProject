import jwt from 'jsonwebtoken';
import { signinSchema } from '../middlewares/validator.js';
import { signupSchema } from '../middlewares/validator.js';
import User from '../models/usersModels.js';
import { doHash, doHashValidation, hmacProcess } from '../utilis/hashing.js';
import transport from '../middlewares/sendMail.js';

export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { error, value } = signupSchema.validate({ email, password });

        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashPassword,
        });
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate input
        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message,
            });
        }
        // Find user and include password
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist',
            });
        }
        // Validate password
        const isPasswordValid = await doHashValidation(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials!',
            });
        }
        // Create JWT
        const token = jwt.sign(
            {
                userID: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '8h',
            }
        );
        // Set cookie and respond
        res.cookie('Authorization', `Bearer ${token}`, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            success: true,
            token,
            message: 'Logged in successfully',
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

export const signout = async (req, res) => {
    res.clearCookie('Authorization').status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

export const sendVerificationCode = async(req, res) => {
    const{email} = req.body
    try {
        const existingUser = await User.findOne({email})
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist',
            });
        }
        if(existingUser.verified){
           
                return res.status(400).json({
                    success: false,
                    message: 'You are already verified!',
                });
            }

            const codeValue = Math.floor(Math.random() * 1000000).toString
            let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: "Verification Code",
            html: '<h1>' + codeValue + '</h1>'
        })

        if(info.accepted[0] === existingUser.email){
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_SECRET)
            existingUser.verificationCode = hashedCodeValue
            existingUser.verificationCodeValidation = Date.now()
            await existingUser.save()
            return res.status(200).json({
                success: true,
                message: 'Code Sent'
            })
        }
        res.status(200).json({
            success: failed,
            message: 'Code Sent Failed'
        })
        

    } catch (error) {
        console.log(error)
        
    }
}
