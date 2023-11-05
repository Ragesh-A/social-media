import { Request, Response } from "express"

export const notFound = async (req:Request, res:Response) => {
  res.json({ success: false, message: 'failed to find the path'})
}