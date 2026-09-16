const { User } = require('../db/index')
const jwt = require('jsonwebtoken')
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const jwt_secret = process.env.JWT_SECRET;

async function UserMiddleware(req,res,next){
    const token = req.headers.authorization;
    console.log("token: ",token);
    const jwtToken = token.split(" ")[1]
    console.log("JWT token: ",jwtToken)
    const decoded = jwt.verify(jwtToken,jwt_secret);
    console.log("decoded: ",decoded)
    req.username = decoded
    if (decoded){
        next();
    } else {
        res.status(403).json({
            "message": 'you are not authrized'
        })
    }

}
module.exports = UserMiddleware;
