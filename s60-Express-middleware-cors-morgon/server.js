const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("node:fs");
const path = require("node:path");
const app = express();
app.use(cors());
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
let emwf1 = (req, res, next) => {
  console.log("inside emwf1");
  next();
};
let emwf2 = (req, res, next) => {
  console.log("inside emwf2");
  next();
};
let emwf3 = (req, res, next) => {
  console.log("inside emwf3");
  next();
};
app.use(emwf1);
app.use(emwf2);
app.use(emwf3);

app.get("/lists", async (req, res) => {
  let countriesList = await Employee.find().distinct("country");
  let departmentsList = await Employee.find().distinct("department");
  let genderList = await Employee.find().distinct("gender");

  let listsObj = {
    countries: countriesList,
    departments: departmentsList,
    genders: genderList,
  };
  res.json(listsObj);
});
// app.get("/getEmployees", async (req, res) => {
//   console.log(req.query);
//   let employeesData = await Employee.find().and([
//     { country: req.query.country },
//     { department: req.query.department },
//     { gender: req.query.gender },
//   ]);
//   res.json(employeesData);
//});
let employeeSchema = new mongoose.Schema({
  id: Number,
  profilePic: String,
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  gender: String,
  department: String,
  country: String,
});

app.get("/getEmployees/:country/:department/:gender", async (req, res) => {
  console.log("Inside callback fun");
  console.log(req.params);
  let employeesData = await Employee.find()
    .and([
      { country: req.params.country },
      { department: req.params.department },
      { gender: req.params.gender },
    ])
    .limit(req.query.limit)
    .sort(req.query.order == "desc" ? "-id" : "id");
  res.json(employeesData);
});
app.listen(4567, () => {
  console.log("Listening to port 4567");
});

let Employee = new mongoose.model("employee", employeeSchema);

let connectToMDB = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://sumanthdps:sumanth@mern2406.9fvsa.mongodb.net/Tata?retryWrites=true&w=majority&appName=Mern2406"
    );
    console.log("Succcesfully connected to MongoDB");
  } catch (err) {
    console.log(err);
    console.log("unable to connect to MongoDB");
  }
};
connectToMDB();
