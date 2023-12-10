import { Request } from "express";

interface LoggedUserRequest extends Request {
  userId?: string;
  role?: string
}

export { LoggedUserRequest }