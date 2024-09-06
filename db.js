const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://toyashpatil17:OoaYUdnaTpfvlLgC@cluster0.lm749.mongodb.net/";

const connectTOMongo = async () => {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongodb")

}

module.exports = connectTOMongo;