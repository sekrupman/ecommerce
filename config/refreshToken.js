const jwt = require("jsonwebtoken");
const generateRefreshToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_KEY, {expiresIn: "3d"})
}

module.exports = {generateRefreshToken}