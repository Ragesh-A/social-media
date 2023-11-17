import Joi from "joi";

export const postSchema = Joi.object({
  caption: Joi.string().max(100),
  image: Joi.string().required(),
  tags: Joi.array().required().max(5).min(1)
})