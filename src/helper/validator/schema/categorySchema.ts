import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().trim().required().min(5).max(20),
  image: Joi.string().trim().required()
})

export default categorySchema