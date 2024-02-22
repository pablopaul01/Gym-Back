require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dbConnection = require("./database/db");
const router = require("./routes");
const cloudinary = require("cloudinary").v2;
const jwtStrategy = require("./passport/jwt");
const passport = require("passport");

const app = express();

//midlewares
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

//passport
passport.use("jwt", jwtStrategy);


//configuracion de rutas
app.use("/", router);

dbConnection();

app.listen(8080, () => {
    console.log(`Servidor funcionando en el puerto ${8080}`);
})