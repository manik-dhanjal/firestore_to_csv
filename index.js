const express = require("express");
const app = express();
require('dotenv').config()

const odomosRoutes = require("./src/routes/odomos.routes");

app.use('/odomos-quiz', odomosRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT,() => {
    console.log("Server started at PORT:",PORT);
})