const jwt = require('jsonwebtoken');
const { signinSchema } = require('../middlewares/validator');
const { signupSchema } = require('../middlewares/validator');
const User = require('../models/usersModels');
const { doHash, doHashValidation } = require('../utilis/hashing');

exports.signup = async (req, res) => {
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

exports.signin = async (req, res) => {
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

exports.signout = async (req, res) => {
    res.clearCookie('Authorization').status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
