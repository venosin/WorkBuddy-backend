import express from "express";
const router = express.Router();

import registerClientController from "../controllers/registerClientController.js";

router.route("/").post(registerClientController.register);
router.post("/verifyCodeEmail", registerClientController.verifyCodeEmail);

export default router;
