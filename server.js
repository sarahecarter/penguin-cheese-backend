////////////////////////
// Dependencies 
////////////////////////
const express = require("express")
require("dotenv").config()
const {PORT = 3001, DATABASE_URL} = process.env
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

// app object
const app = express()


////////////////////////
// Mongoose Connection 
////////////////////////
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disconnected from Mongo"))
.on("error", (err) => console.log(err))


////////////////////////
// Model 
////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
}, {timestamps: true})

const Cheese = mongoose.model("Cheese", CheeseSchema)


////////////////////////
// Middleware
////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

////////////////////////
// Routes 
////////////////////////
// test route 
app.get("/", (req, res) => {
    res.send("Hello World")
})

// index route 
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}))
    }
    catch (error) {
        res.status(400).json(error)
    }
})

// create route
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body))
    }
    catch (error) {
        res.status(400).json(error)
    }
})

// update route
app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    }
    catch (error) {
        res.status(400).json(error)
    }
})

// delete route 
app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    }
    catch (error) {
        res.status(400).json(error)
    }
})

////////////////////////
// Listener 
////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));