const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listings');
const express = require('express');

const mongo_URL = "mongodb://127.0.0.1:27017/test";

async function main(){
    try {
        await mongoose.connect(mongo_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

main();

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        console.log("Existing data deleted");
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

initDB();