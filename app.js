const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes')

dotenv.config()

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors);

app.use('/api/auth', authRoutes)

module.exports = app;