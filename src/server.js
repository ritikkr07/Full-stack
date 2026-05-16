const express = require('express');
const app = express();
require("dotenv").config();
const connectDB = require("./config/db.js");

// Security Packages
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

connectDB();

// Enable CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Set security headers
app.use(helmet());

// Sanitize data
// Workaround for Express 5 where req.query, req.body, req.params are getters
app.use((req, res, next) => {
  ['query', 'params', 'body'].forEach((key) => {
    if (req[key]) {
      Object.defineProperty(req, key, {
        value: { ...req[key] },
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
  });
  next();
});
app.use(mongoSanitize());

// Prevent http param pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// ROUTES
app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/users", require("./routes/user.routes.js"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
