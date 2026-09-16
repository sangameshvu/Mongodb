const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const jwt_secret = process.env.JWT_SECRET;

function AdminMiddleware(req,res,next){
    const token = req.headers.authorization;

    const jwt_token = token.split(' ')[1];
    const decoded = jwt.verify(jwt_token, jwt_secret);
    req.username = decoded
    if(!(decoded)){
        res.status(403).json({
            "message": "you are not authorized"
        })
    } else {
        next();
    }
}

module.exports = AdminMiddleware
