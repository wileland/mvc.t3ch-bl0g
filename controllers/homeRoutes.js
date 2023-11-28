const router = require("express").Router();
const config = require("../../config/config");

const { Post, User } = require("../models");
// Additional imports, such as middleware to check for authentication, may be required.

// Root route - GET request to the homepage
router.get("/", async (req, res) => {
  try {
    // Fetch posts from the database
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"], // Replace 'name' with the actual column name for the username in your User model.
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("homepage", {
      posts,
      loggedIn: req.session.loggedIn, // You'll need to set this in your session when a user logs in.
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
