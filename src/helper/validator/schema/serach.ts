import Joi from 'joi'

export interface ISearchQuery{
  page: number;
  q: any;
  role: string;
  orderBy: 'asc' | 'desc';

}

const searchSchema = Joi.object<ISearchQuery>({
  page: Joi.number(),
  q: Joi.string().min(0),
  role: Joi.string(),
  orderBy: Joi.string(),
})

export default searchSchema;