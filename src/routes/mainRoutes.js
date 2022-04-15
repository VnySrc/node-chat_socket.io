import { Router } from "express";
const router = Router()

import * as chatController from "../controllers/chatController.js"

router.get("/", chatController.showPage)

export default router