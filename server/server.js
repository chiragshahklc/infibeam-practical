import express from "express"
import cors from "cors"
import bodyparser from "body-parser"
import helmet from "helmet"
import path from "path"
const morgan = require("morgan")
import handler from "./handlers"

const app = express()

// setup morgan with express
app.use(morgan("tiny"))

// use cors with express
app.use(cors())

// use bodyparser with express
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

// use helmet with express
app.use(helmet())
// serve react build files from directory
app.use(express.static(path.join(__dirname, "www")))

// API Test node to check if API Server is UP or not
app.get("/test", (req, res) => res.status(200).send("API Server is Working."))

app.get("/servers", (req, res) => {
    console.log(req.query)
    const { storage, ram, hdd, location } = req.query
    handler.Server.fetchServers({
        storage,
        ram,
        hdd,
        location,
    })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(400).json({ status: 400, Error: "Failed" }))
})

app.post("/servers", (req, res) => {
    const { servers } = req.body
    handler.Server.addServers(servers)
        .then((success) =>
            res.status(201).json({ status: 201, msg: "Created successfully" })
        )
        .catch((err) => res.status(400).json({ status: 400, Error: "Failed" }))
})

app.get("/filters/location", (req, res) => {
    handler.Server.fetchDistinctLocations()
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(400).json({ status: 400, Error: "Failed" }))
})

app.get("/", (req, res) => res.status(200).sendfile("index.html"))

app.all("*", (req, res) => {
    res.status(400).json({
        error: { code: 400, message: "Bad Request - Url not found" },
    })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log("Server started on port", PORT)
})
