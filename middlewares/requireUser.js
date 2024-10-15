const jwt = require('jsonwebtoken');

const requireUser = async (req, res, next) => {
  // Check if user is authenticated
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    // return res.status(401).send("Authorization header is required");
    return res.send(error(401, `Authorization header is required`));
  }

  const accessToken = req.headers.authorization.split(" ")[1];
  console.log(`I am inside middleware your token: ${accessToken} `);

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );

    req._id = decoded._id;
    next();

  } catch (error) {
    console.log(error);
    // return res.status(403).send("Invalid access key");
    return res.send(error(403, `Invalid access key`));
  }
};

module.exports = requireUser;
