// importar lo de lalibreria "express"
import express from "express" ;
import cors from "cors";
//ENDPOINTS STEVEN imports ruotes from steven
import productsRoutes from "./src/routes/products.js";
import ordersRoutes from "./src/routes/orders.js";
import shoppingCartsRoutes from "./src/routes/shoppingCarts.js";
import reviewsRoutes from "./src/routes/reviews.js";
import registerEmployeeRoutes from "./src/routes/registerEmployee.js";
import registerClientRoutes from "./src/routes/registerClient.js"
//ENDPOINTS imports routes from RODRI
import clientsRouter from "./src/routes/clients.js";
import dCodesRouter from "./src/routes/dCodes.js"
import employeesRoutes from "./src/routes/employees.js";
import offersRoute from "./src/routes/offers.js"
import cookieParser from "cookie-parser";
//login y logut
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
//recuperación de contraseña
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";
import resetPasswordRoutes from "./src/routes/resetPassword.js";
import { validateAuthToken } from "./src/middlewares/authMiddleware.js";
// Nuevas rutas de perfil de usuario, favoritos, configuración y pedidos
import profileRoutes from "./src/routes/profile.js";
import favoritesRoutes from "./src/routes/favorites.js";
import userSettingsRoutes from "./src/routes/userSettings.js";

import swagger from "swagger-ui-express";
import fs from "fs";
import path from "path";


// Nuevas rutas de pagos
import paymentRoutes from "./src/routes/payment.js";

//Creso la constante para poder usar express en otros archivos
const app = express();

// Middlewares
app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"], // Dominios permitidos
      credentials: true, // Permitir envío de cookies y credenciales
    })
  );

// Middleware para debugging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

//middleware para aceptar datos desde postman
app.use(express.json()); // Aceptar JSON en las solicitudes
app.use(cookieParser()); //Para que POSTMAN guarde el token en una cookie 
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("./jsonSwagger.json"), "utf-8")
);

//Mando a llamar a rutas 
//RODRI
app.use("/api/docs", swagger.serve, swagger.setup(swaggerDocument));
app.use("/wb/clients", clientsRouter);
app.use("/wb/discountCodes", dCodesRouter)
app.use("/wb/employees", /*validateAuthToken(["employees", "admin"] )*/ employeesRoutes);
app.use("/wb/offers", offersRoute)
// steven
app.use("/wb/products", productsRoutes);
app.use("/wb/orders", ordersRoutes);
app.use("/wb/shoppingCarts", shoppingCartsRoutes);
app.use("/wb/reviews", reviewsRoutes);
app.use("/wb/logout", logoutRoutes);

// Nuevas rutas del perfil de usuario
app.use("/wb/profile", profileRoutes);
app.use("/wb/favorites", favoritesRoutes);
app.use("/wb/settings", userSettingsRoutes);

// Rutas de pagos
app.use("/wb/payment", paymentRoutes);

// Rutas publicas que no necesitan haber iniciado sesión
app.use("/wb/registerEmployee", registerEmployeeRoutes);
app.use("/wb/registerClient", registerClientRoutes);
app.use("/wb/login", loginRoutes);
app.use("/wb/passwordRecovery", passwordRecoveryRoutes);
app.use("/wb/reset", resetPasswordRoutes);

export default app;

  

