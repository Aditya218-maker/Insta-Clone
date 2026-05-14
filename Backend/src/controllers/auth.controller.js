const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


async function registerController(req, res) {
    const { email, name, password, username, bio, profileImage } = req.body

    const isUserAlreadyExists = await userModel.findOne({ 
        $or: [
            { username },
            { email }
        ]
     })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "User already exists" + (isUserAlreadyExists.email == email ? "email already exists" : "username already exists")
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const user = await userModel.create({
        email, password: hash, username, bio, profileImage
    })

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET, {expiresIn:"1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "user registered",
        user:{
            email:user.email,
            username:user.username,
            bio:user.bio,
            profileImage: user.profileImage
        },
        token
    })
}
async function loginController(req, res) {
    const { username, email, password } = req.body

    /**
     * username
     * password
     * 
     * email
     * password
     */

    /**
     * { username:undefined,email:test@test.com,password:test } = req.body
     */

    const user = await userModel.findOne({
        $or: [
            {
                username: username
            },
            {
                email: email
            }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const hash = crypto.createHash('md5').update(password).digest('hex')

    const isPasswordValid = hash == user.password

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "password invalid"
        })
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)


    res.status(200)
        .json({
            message: "User loggedIn successfully.",
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        })
}
module.exports = {
    registerController,
    loginController
}