require("dotenv").config();

const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/sequelize"); // Corrected import
const passport = require("./config/passport-config");

// Import routes from controllers
const homeRoutes = require("./controllers/homeRoutes");
const dashboardRoutes = require("./controllers/dashboardRoutes");
const userRoutes = require("./controllers/api/user"); // Updated path
const postRoutes = require("./controllers/api/posts"); // Updated path
const commentRoutes = require("./controllers/api/comments"); // Updated path

const app = express();
const PORT = process.env.PORT || 3306;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session store setup
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 1800000, // Example: 30 minutes
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up Handlebars.js engine with custom helpers
const helpers = require("./utils/helpers"); // Adjust the path to your helpers folder
const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "public")));

// Define routes using the updated paths
app.use("/", homeRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use(passport.initialize());
app.use(passport.session());

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).send("404: Page not found");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).send("Server error");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
