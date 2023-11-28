const jwt = require("jsonwebtoken");
const config = require("./config");

function authenticate(req, res, next) {
  // Extract the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Verify the token using the secret key
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the decoded user information to the request for future use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  });
}

module.exports = { authenticate };
