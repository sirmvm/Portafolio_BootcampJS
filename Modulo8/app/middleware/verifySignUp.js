const db = require("../models");
const { HTTPError } = require("../utils/errors");
const User = db.users;

async function verifySignUp(req, res, next) {
  try {
    const { email } = req.body;
    const existingEmailUser = await User.findOne({ where: { email } });
    if (existingEmailUser) {
      throw new HTTPError(409, "Email ya se encuentra registrado");
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = verifySignUp;
