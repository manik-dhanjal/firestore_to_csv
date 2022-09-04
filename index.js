const express = require("express");
const app = express();
require('dotenv').config()

const odomosRoutes = require("./src/routes/odomos.routes");

app.use('/odomos-quiz', odomosRoutes);

app.get('/',(req,res) =>{
    res.send(`
        <HTML>
            <Head>
                <Title> 
                 
                </Title>
            </Head>
            <Body>
                <a href="/odomos-quiz">click here for Odomos CSV file</a>
            </Body>
        </HTML>
    `)
})
const PORT = process.env.PORT || 8080;

app.listen(PORT,() => {
    console.log("Server started at PORT:",PORT);
})