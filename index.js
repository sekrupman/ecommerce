const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


// Connect to the database
dbConnect();

// Middleware
app.use(morgan('dev'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/user', authRouter);
app.use('/api/products', productRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler); 

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
