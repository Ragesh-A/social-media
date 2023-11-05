import Joi from 'joi';

const registrationSchema = Joi.object({
  name: Joi.string().trim().required().min(5).max(20).messages({
    'string.base': 'Name must be string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least {#limit} character',
    'string.max': 'Name must not exceed {#limit} character',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.base': 'Email must be string',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().trim().required().min(5).messages({
    'string.base': 'Password must be string',
    'string.min': 'Password must be at least {#limit} character',
    'string.empty': 'Password is required',
  })
})
const loginSchema = Joi.object({
  email: Joi.string().trim().required().email().messages({
    'string.base': 'Email must be string',
    'string.empty': 'Email is required',
    'string.min': 'Email must be at least {#limit} character',
    'string.max': 'Email must not exceed {#limit} character',
  }),
  password: Joi.string().trim().required().min(5).messages({
    'string.base': 'Password must be string',
    'string.min': 'Password must be at least {#limit} character',
    'string.empty': 'Password is required',
  })
})

export {registrationSchema, loginSchema}