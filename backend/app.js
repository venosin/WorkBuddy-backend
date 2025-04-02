// importar lo de lalibreria "express"
import express from "express" ;
import cors from "cors";
//ENDPOINTS STEVEN imports ruotes from steven
import productsRoutes from "./src/routes/products.js";
import ordersRoutes from "./src/routes/orders.js";
import shoppingCartsRoutes from "./src/routes/shoppingcarts.js";
import reviewsRoutes from "./src/routes/reviews.js";
//ENDPOINTS imports routes from RODRI
import clientsRouter from "./src/routes/clients.js";
import dCodesRouter from "./src/routes/dCodes.js"
import employeesRoutes from "./src/routes/employees.js"
import offersRoute from "./src/routes/offers.js"
//Creso la constante para poder usar express en otros archivos
const app = express();

// Middlewares
app.use(
    cors({
      origin: "http://localhost:5173", // Dominio del cliente
      credentials: true, // Permitir envío de cookies y credenciales
    })
  );

//middleware para aceptar datos desde postman
app.use(express.json()); // Aceptar JSON en las solicitudes
app.use("/wb/clients", clientsRouter);
app.use("/wb/discountCodes", dCodesRouter)
app.use("/wb/employees", employeesRoutes)
app.use("/wb/offers", offersRoute)
//Archivo la constante para poder usar express en otros archivos

//Mando a llamar a rutas steven
app.use("/wb/products", productsRoutes);
app.use("/wb/orders", ordersRoutes);
app.use("/wb/shoppingcarts", shoppingCartsRoutes);
app.use("/wb/reviews", reviewsRoutes);

export default app;



