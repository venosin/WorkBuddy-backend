// importar lo de lalibreria "express"
import express from "express";
import clientsRouter from "./src/routes/clients.js";
import dCodesRouter from "./src/routes/dCodes.js"
import employeesRoutes from "./src/routes/employees.js"
import offersRoute from "./src/routes/offers.js"
//Creso la constante para poder usar express en otros archivos
const app = express();

//middleware para aceptar datos desde postman
app.use(express.json());
app.use("/wb/clients", clientsRouter);
app.use("/wb/discountCodes", dCodesRouter)
app.use("/wb/employees", employeesRoutes)
app.use("/wb/offers", offersRoute)
//Archivo la constante para poder usar express en otros archivos
export default app;

//Mandae a llamar a rutas
