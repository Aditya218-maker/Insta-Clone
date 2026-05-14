const express = require('express')
const authController = require("../controllers/auth.controller")

const authRouter = express.Router()

const { profile } = require('console')

/**
 * /api/auth/register
 */
authRouter.post("/register", authController.registerController)


/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.loginController)

module.exports = authRouter