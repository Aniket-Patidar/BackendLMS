// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const userRouter = require("./router/userRouter");
const courseRouter = require("./router/courseRouter");
const adminRouter = require("./router/adminRouter");
const errorMiddleware = require('./middleware/error');
const connectDB = require('./models/connectDB');
dotenv.config(".env");
const axios = require('axios');


/* middlewares */
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);
app.use("*", (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "Not Found"
    })
});


/* server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(errorMiddleware);