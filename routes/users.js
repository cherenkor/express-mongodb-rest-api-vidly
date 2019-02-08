const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { pick } = require("lodash");
const router = require("express").Router();
const { User, validateUser } = require("../models/user");

router.get("/", auth, async (req, res) => {
  const users = await User.find().select("-password");
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const userData = req.body;
  const { error } = validateUser(userData);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: userData.email });
  if (user)
    return res
      .status(400)
      .send(`User with email ${userData.email} has already been registered.`);

  user = new User(userData);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(pick(user, ["_id", "name", "email"]));
});

module.exports = router;
