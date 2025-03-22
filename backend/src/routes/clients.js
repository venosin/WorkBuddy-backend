import express from "express";
import clientsController from "../controllers/clientsController.js";

const router = express.Router();

router
  .route("/")
  .get(clientsController.getClients)
  .post(clientsController.createClients);

router
  .route("/:id")
  .get(clientsController.get1Client)
  .delete(clientsController.deleteClients)
  .put(clientsController.updateClient);
export default router;
