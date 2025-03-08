const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "b66b63447405da91740795d06b46adfde2623fb04d2fc6047b86045eccdf143bab70ba1dfc728f5e583a20efb9263367060fb75efbd0e02f92043dbc66d5c037";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authenticateToken;
