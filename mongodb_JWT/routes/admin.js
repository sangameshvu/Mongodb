const express = require('express');
const AdminMiddleware = require('../middlewares/admin');
const { Admin, Course } = require('../db/index');
const router = express.Router();
const jwt = require('jsonwebtoken')

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const jwt_secret = process.env.JWT_SECRET;

router.post('/signup', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const check = await Admin.findOne({
        username : username,
        password : password
    })
    if (check){
        res.json({
            'message': 'User already exists'
        })
    } else {
        const create = await Admin.create({
            username,
            password
        })
        .catch(()=>{
            res.json({
                "message" : 'Admin not created'
            })
        })
        if (create) {

            res.status(200).json({
                "message":'Admin created Successfully'
            })
        }
    }

})
router.post('/signin',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const exists = await Admin.findOne({
        username,
        password
    })
    if(!(exists)){
        res.status(401).json({
            "Message": "invalid creds"
        })
    } else {
        const token = jwt.sign(username, jwt_secret);
        res.status(200).json({
            "message":token
        })
    }

})
router.post('/courses',AdminMiddleware, async (req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    const admin = await Admin.findOne({
        username : req.headers.username,
    })
    console.log(admin)
    if (!(admin)){
        res.status(403).json({
            "message":"admin doesn't exist"
        })
    } else {
        const newCourse = await Course.create({
            title,
            description,
            price,
            imageLink,
            author : admin._id
        })
        res.status(200).json({
            "message" : "Course created successfully",
            'CourseId' : newCourse._id
        })

    }
})

router.get('/allCourses',AdminMiddleware,async (req,res)=>{

    const admin =await Admin.findOne({
        username : req.username
    })   

    const courses = await Course.find({
        author : admin._id
    })
    res.status(200).json({
        "message" : courses
    })
})

module.exports = router;
