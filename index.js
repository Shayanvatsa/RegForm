const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@atlascluster.oa9ivbc.mongodb.net/regformDDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({ name: String, email: String, password: String });

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name, email, password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.get("/users", async (req, res) => {
    try {
        const users = await Registration.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
