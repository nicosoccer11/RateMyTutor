const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <Token>

  if (token == null) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token verification failed
    req.user = user; // Attach the user payload to the request
    next(); // Proceed to the next middleware/route handler
  });
};

module.exports = authenticateToken;