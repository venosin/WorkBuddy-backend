import dotenv from "dotenv";

//Configuro dotenv
dotenv.config();

export const config = {
    db: {
    DB_URI: process.env.DB_URI
    },
    server: {
    PORT: process.env.PORT
    }
};

