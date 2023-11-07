import { Request } from "express";

interface LoggedUserRequest extends Request {
  userId?: string;
}

export {LoggedUserRequest}