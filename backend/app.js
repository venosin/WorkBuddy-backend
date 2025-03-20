// importar lo de lalibreria "express"
import express from "express" ;


//Creso la constante para poder usar express en otros archivos
const app = express();

//middleware para aceptar datos desde postman
app.use(express.json());

//Archivo la constante para poder usar express en otros archivos
export default app;

//Mandae a llamar a rutas




