const express = require('express');
const AdminMiddleware = require('../middlewares/admin');
const { Admin, Course } = require('../db/index');
const router = express.Router();

console.log("ADMIN.JS LOADED:", new Date().toISOString());

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

router.post('/courses',AdminMiddleware, async (req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    const user = await Admin.findOne({
        username : req.headers.username,
        password : req.headers.password
    })
    if (!(user)){
        res.status(403).json({
            "message":"admin doesn't exist"
        })
    } else {
        const newCourse = await Course.create({
            title,
            description,
            price,
            imageLink
        })
        res.status(200).json({
            "message" : "Course created successfully",
            'CourseId' : newCourse._id
        })

    }
})

router.get('/getcourses',AdminMiddleware,async (req,res)=>{
    const courses = await Course.find({})
    res.status(200).json({
        "message" : courses
    })
})

module.exports = router;
