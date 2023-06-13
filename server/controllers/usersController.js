const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already taken", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email is already registered", status: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashPassword,
    });

    //used to remove a property from an object.
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
     next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect username", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.json({ msg: "Incorrect password", status: false });
    }
    //used to remove a property from an object.
    delete user.password;
    
    return res.json({ status: true, user });
  } catch (error) {
     next(error);
  }
};
