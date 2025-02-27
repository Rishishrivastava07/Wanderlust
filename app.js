const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const port = 8080;

const mongo_URL = "mongodb://127.0.0.1:27017/test";

async function main() {
  try {
    await mongoose.connect(mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

main();

app.engine("ejs", ejsMate); // Use ejs-mate for layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON data
app.use(methodOverride("_method")); // Middleware to override methods
app.use(express.static(path.join(__dirname, "public"))); // Middleware to serve static files

//index route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Error fetching listings");
  }
});

//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).send("Error fetching listing");
  }
});

//Create route
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log("Listing created:", newListing);
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).send("Error creating listing");
  }
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    console.error("Error fetching listing for edit:", err);
    res.status(500).send("Error fetching listing for edit");
  }
});

//Update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
    });
    console.log("Listing updated:", listing);
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).send("Error updating listing");
  }
});

//delete route
app.delete("/listings/:id", async (req, res) => {
  let id = req.params.id;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("Deleted listing:", deletedListing);
  res.redirect("/listings");
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
