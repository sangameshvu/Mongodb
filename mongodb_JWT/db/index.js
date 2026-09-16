const mongoose = require('mongoose');

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const mongodb_url = process.env.MONGODB_URL2;

// console.log(mongodb_url);
mongoose
  .connect(mongodb_url)
  .then(()=>{
    // console.log(`MongoDB connected successfully`);
    // console.log(mongoose.connection.name)
  })
  .catch((err)=>{
    console.log('Error while connecting to the DB');
    process.exit(1);
  })

const AdminSchema = mongoose.Schema({
  username : String,
  password : String,
})

const UserSchema = mongoose.Schema({
  username : String,
  password : String,
  purchasedCourses : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Course'
  }]
})

const CourseSchema = mongoose.Schema({
  title : String,
  description : String,
  price : Number,
  imageLink : String,
  author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Admin'
  }

})

const Admin = mongoose.model("Admin",AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course",CourseSchema);

module.exports = {
  Admin,
  User,
  Course
}
