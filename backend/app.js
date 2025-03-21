// importar lo de lalibreria "express"
import express from "express";
import clientsRouter from "./src/routes/clients.js";
import dCodesRouter from "./src/routes/dCodes.js"
//Creso la constante para poder usar express en otros archivos
const app = express();

//middleware para aceptar datos desde postman
app.use(express.json());
app.use("/wb/clients", clientsRouter);
app.use("/wb/discountCodes", dCodesRouter)
//Archivo la constante para poder usar express en otros archivos
export default app;

//Mandae a llamar a rutas
