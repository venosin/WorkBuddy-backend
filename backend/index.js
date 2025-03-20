// importo el archivo app.js
import app from "./app.js";
import "./database.js";
import { config } from "./src/config.js";


// Creo una función
// que se encarga de ejecutar el servidor
async function main() {
    app.listen(config.server.PORT);
    console.log("server runing","",+ config.server.PORT);
}

//ejecutamos todos
main();