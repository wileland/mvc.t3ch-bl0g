require("dotenv").config();

const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Import your Sequelize instance from a config file
const sequelize = require("./config/config");

const app = express();
const PORT = process.env.PORT || 3000;

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
const hbs = exphbs.create({ helpers: require("./utils/helpers") });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const homeRoutes = require("./controllers/homeRoutes");
const dashboardRoutes = require("./controllers/dashboardRoutes");

app.use("/", homeRoutes);
app.use("/dashboard", dashboardRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).send("404: Page not found");
});

// Asynchronous Error Handler
app.use(async (err, req, res, next) => {
  console.error("Asynchronous error:", err);
  res.status(500).send("Server error");
});

// Synchronous Error Handler
app.use((err, req, res, next) => {
  console.error("Synchronous error:", err);
  res.status(500).send("Server error");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
