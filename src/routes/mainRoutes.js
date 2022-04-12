import { Router } from "express";
const router = Router()

import * as chatController from "../controllers/chatController"

router.get("/", chatController.renderPage)