const router = require("express").Router();
const { Post, User } = require("../models");

// Root route - GET request to the homepage
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"], // Adjust as per your User model's attributes
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    res.render("homepage", { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
