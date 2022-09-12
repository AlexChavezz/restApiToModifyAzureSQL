const cors = require("cors");
const express = require("express");
const res = require("express/lib/response");
require("dotenv").config();

const app = express();
const port = process.env["PORT"];   

app.use(express.json());
app.use(cors());
app.use("/", require("./routes/model.routes"));

app.listen(port, ()=> {
    console.log(`Listen on port ${port}`)
})