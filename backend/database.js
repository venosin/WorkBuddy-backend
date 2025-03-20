import mongoose from "mongoose"; 
import { config } from "./src/config.js"; //Configuración de la base de datos

//2- cONECTO la base de datos
mongoose.connect(config.db.DB_URI);

// ----------------------Comprobar que todo funciona ------------

const connection = mongoose.connection;

//veo si funciona
connection.once("open" , ()=>{
    console.log("DB is connected");
})

//veo si se desconecto
connection.once("disconnected", ()=> {
    console.log("DB is disconnected");
})

connection.once("error", ()=> {
    console.log("Error in the connection");
    })
//-3 Crear una constante 