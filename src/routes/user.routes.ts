import { Router } from "express";
import { adminMiddleWare } from "../middleware";
import { getAllUsers, getUser } from "../controller/user.controller";

const router = Router()

router.use(adminMiddleWare)
router.get('', getAllUsers)
router.get('/:userId', getUser)

export default router;