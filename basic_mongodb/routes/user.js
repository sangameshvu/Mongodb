const express = require('express');
const { User, Course } = require('../db/index');
const UserMiddleware = require('../middlewares/user');
const router = express.Router();

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

router.get('/courses',async (req,res)=>{
    const allcourse = await Course.find({})
    res.status(200).json({
        allcourse
    })
})

router.post('/courses/:courseId', UserMiddleware, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const username = req.headers.username;

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
    const username = req.headers.username;
    const userExists = await User.findOne({
        username: username
    })

    if (!(userExists)){
        res.status(500).json({
            "message":'user doesnt exists'
        })
    } else {
        const username = req.headers.username;
        const user = await User.findOne({
            username: username
        }).populate("purchasedCourses");

        res.json({
        purchasedCourses: user.purchasedCourses
    });
    }
})
module.exports = router;
