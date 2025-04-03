import dotenv from "dotenv";

//Configuro dotenv
dotenv.config();

export const config = {
  db: {
    DB_URI: process.env.DB_URI,
  },
  server: {
    PORT: process.env.PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secreto123",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },
  email: {
    email: "noreply.byteshop@gmail.com",
    password: process.env.APP_PASSWORD_EMAIL,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
//   paypal: {
//     clientId: process.env.PAYPAL_API_CLIENT_ID,
//     clientSecret: process.env.PAYPAL_API_SECRET,
//     PAYPAL_API: "https://api-m.sandbox.paypal.com/",
//   },
};
