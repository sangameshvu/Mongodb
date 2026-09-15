const mongoose = require("mongoose");

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const mongodb_url = process.env.MONGODB_URL;

if (!mongodb_url) {
  console.error("MONGODB_URL is not defined in the environment.");
  process.exit(1);
}

console.log("MongoDB URL loaded:", mongodb_url);

mongoose
  .connect(mongodb_url)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

const AdminSchema = new mongoose.Schema({
    username : String,
    password : String
})

const UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    purchasedCourses: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    }]
})

const CourseSchema = new mongoose.Schema({
    title : String,
    description : String,
    imageLink : String,
    price : Number
})

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course",CourseSchema);

module.exports = {
  Admin,
  User,
  Course
}
