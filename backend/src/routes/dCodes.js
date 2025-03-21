import express from "express"
import dCodesController from "../controllers/dCodesController.js"

const router = express.Router();

router.route("/")
.get(dCodesController.getCodes)
.post(dCodesController.createCodes)

router.route("/:id")
.delete(dCodesController.deleteCode)
.put(dCodesController.updateCode)
.get(dCodesController.getCodeById)

router.route("/code/:code")
.get(dCodesController.getCodeByCode)

export default router;

