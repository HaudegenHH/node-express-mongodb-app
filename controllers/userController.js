const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//@desc Register a user
//@route POST /api/users
//@access public 
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('All fields are required')
    }
    const userAvailable = await User.findOne({ email })
    if (userAvailable) {
        res.status(400)
        throw new Error('User already registered')
    }

    // hash password, additionally providing number of salt rounds
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ 
        username,
        email,
        password: hashedPassword
    })

    if (user) {
        console.log(`User created successfully: ${user}`);
        res.status(201).json({ _id: user.id, email: user.email })
    } else {
        res.status(400)
        throw new Error('User data is not valid')
    }

    res.json({ message: 'Register the user'})
})

//@desc Login a user
//@route POST /api/users/login
//@access public 
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('All fields are required')
    }
    
    let user = await User.findOne({email})

    //checking if the user exist 
    if (user && bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "18m" }
        )
        res.status(200).json({accessToken})

    } else {
        res.status(401)
        throw new Error('Invalid Credentials');
    }

})


//@desc Get current user information
//@route GET /api/users/current
//@access private 
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user)
})

module.exports = { registerUser, loginUser, currentUser }