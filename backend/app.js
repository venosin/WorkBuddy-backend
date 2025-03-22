// importar lo de lalibreria "express"
import express from "express" ;
import productsRoutes from "./src/routes/products.js";
import ordersRoutes from "./src/routes/orders.js";
import shoppingCartsRoutes from "./src/routes/shoppingcarts.js";
import reviewsRoutes from "./src/routes/reviews.js";
//Creso la constante para poder usar express en otros archivos
const app = express();

//middleware para aceptar datos desde postman
app.use(express.json());

//Archivo la constante para poder usar express en otros archivos
export default app;

//Mando a llamar a rutas
app.use("/wb/products", productsRoutes);
app.use("/wb/orders", ordersRoutes);
app.use("/wb/shoppingcarts", shoppingCartsRoutes);
app.use("/wb/reviews", reviewsRoutes);



