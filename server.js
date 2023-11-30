require("dotenv").config();

const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/sequelize");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session store setup
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1800000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up Handlebars.js engine with custom helpers
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.use("/", homeRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).send("404: Page not found");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.status || 500;
  let errorResponse = {
    status: "error",
    message: "An unexpected error occurred",
  };
  if (process.env.NODE_ENV === "development") {
    errorResponse = {
      ...errorResponse,
      message: err.message,
      stack: err.stack,
    };
  }
  res.status(statusCode).json(errorResponse);
});

// Database Connection and Server Initialization
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
    // Sync models with the database
    return sequelize.sync(); // You might use { force: true } during development
  })
  .then(() => {
    // Start the Express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Import routes from controllers
const homeRoutes = require("./controllers/homeRoutes");
const dashboardRoutes = require("./controllers/dashboardRoutes");
const userRoutes = require("./controllers/api/userRoutes");
const postRoutes = require("./controllers/api/postRoutes");
const commentRoutes = require("./controllers/api/commentRoutes");
