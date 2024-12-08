import Joi from 'joi';

export const signupSchema = Joi.object({
    email: Joi.string()
        .min(8)
        .max(60)
        .required()
        .email({
            tlds: { allow: ['com', 'net'] }
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
});

export const signinSchema = Joi.object({
    email: Joi.string()
        .min(8)
        .max(60)
        .required()
        .email({
            tlds: { allow: ['com', 'net'] }
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
})
