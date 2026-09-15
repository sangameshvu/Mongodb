const { User } = require('../db/index')

async function UserMiddleware(req,res,next){
    username = req.body.username;
    password = req.body.password;

    const user = await User.findOne({
        username : username,
        password : password
    })
    if (user) {
        next();
    } else {
        res.status(403).json({
            "message" : 'The user profile doesnt exist'
        })
    }
}
module.exports = UserMiddleware;
