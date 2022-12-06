const express = require("express")
const server = express()

const dotenv = require("dotenv").config()

const PORT = process.env.PORT || 5000

//PostgreSQL connection
const { client } = require("./database/db_server");
client.connect();

//Body-parse middleware
server.use(express.json())
server.use(express.urlencoded({extended: false}))

//Routes
server.get("/", (request, response) => {
    response.status(200).json({message: "Welcome to the JuiceBox"})
})

server.use("/api", require("./api/apiServer"))

//error middleware
const {errorHandler} = require("./api/middleware/errorMiddleware")
server.use(errorHandler)

server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})