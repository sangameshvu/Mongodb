const express = require('express');
const { User, Course } = require('../db/index');
const UserMiddleware = require('../middlewares/user');
const router = express.Router();
const jwt = require('jsonwebtoken')

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const jwt_secret = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const exists = await User.findOne({
        username: username,
        password: password
    });
    if(exists){
        res.status(404).json({
            "message": "user already exists"
        })
    } else {
        const newUser = await User.create({
            username,
            password
        })

        res.status(200).json({
            'message': "successfull",
            newUser
        })
    }
});

router.post('/signin',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const exists = await User.findOne({
        username,
        password
    })
    if(!(exists)){
        res.status(401).json({
            "message": "user doesnt exits, please signup"
        })
    } else {
        const token = jwt.sign(username, jwt_secret);
        res.status(200).json({
            "message": "valid",
            "token": token
        })
    }
})
router.get('/allcourses',async (req,res)=>{
    const allcourse = await Course.find({})
    res.status(200).json({
        allcourse
    })
})

router.post('/courses/:courseId', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const username = req.username;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updateUser = await User.updateOne(
            { username },
            {
                $push: {
                    purchasedCourses: courseId
                }
            }
        );

        res.status(200).json({
            message: "Course added successfully",
            updateUser
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

router.get('/purchasedCourses',UserMiddleware,async (req,res)=>{
    const username = req.username;
    const userExists = await User.findOne({
        username: username
    })

    if (!(userExists)){
        res.status(500).json({
            "message":'user doesnt exists'
        })
    } else {
        const user = await User.findOne({
            username: username
        }).populate("purchasedCourses");

        res.json({
        purchasedCourses: user.purchasedCourses
    });
    }
})
module.exports = router;
