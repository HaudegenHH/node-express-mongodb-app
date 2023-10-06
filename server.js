const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const connectDB = require('./config/dbConnection')
require('dotenv').config()

connectDB()
const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use('/api/contacts', require('./routes/contactRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server is listening on port: http://localhost:${PORT}`)
})
