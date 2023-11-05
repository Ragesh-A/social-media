import { connect } from 'mongoose'
import env from 'dotenv'
env.config()

const DB_URL = process.env.DB_URL || '';

export const connectDb = async () => {
  try {
    await connect(DB_URL)
  } catch (error) {
    console.log(error)
  };
}