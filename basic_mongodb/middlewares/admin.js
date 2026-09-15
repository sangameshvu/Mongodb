const {Admin} = require('../db/index');

async function AdminMiddleware(req,res,next){
    const username = req.headers.username;
    const password = req.headers.password;

    const user = await Admin.findOne({
        username : username,
        password : password
    })
    if (user) {
        next();
    } else {
        res.status(403).json({
            "message":'User is not admin'
        })
    }

}
module.exports = AdminMiddleware;
