const User = require("../models/user.model");

const checkEmptyInput = (req, res, next) => {
  const { username, password, confirmedPassword, fullname, email } = req.body;
  let errMessages = {};
  let isAnyEmpty = false;
  if (username === "") {
    errMessages.errUsername = "Username is required";
    isAnyEmpty = true;
  }
  if (password === "") {
    errMessages.errPassword = "Password is required";
    isAnyEmpty = true;
  }
  if (confirmedPassword === "") {
    errMessages.errConfirmedPassword = "Confirmed password is required";
    isAnyEmpty = true;
  }
  if (fullname === "") {
    errMessages.errFullname = "Fullname is required";
    isAnyEmpty = true;
  }
  if (email === "") {
    errMessages.errEmail = "Email is required";
    isAnyEmpty = true;
  }
  if (isAnyEmpty) {
    res.json({ errMessages });
    return;
  }

  next();
};

const checkDuplicateUsernameOrEmailAndMatchedPassword = (req, res, next) => {
  const { username, email, password, confirmedPassword } = req.body;
  // Username
  User.findOne({ username }).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    if (user) {
      res.json({ errMessages: { errSignup: "Username is existed" } });
      return;
    }

    // Password
    if (password !== confirmedPassword) {
      res.status(200).json({
        errMessages: { errSignup: "Passwords are not matched" },
      });
      return;
    }

    // Email
    User.findOne({ email }).exec((err, user) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      if (user) {
        res.json({ errMessages: { errSignup: "Email is existed" } });
        return;
      }
      next();
    });
  });
};

module.exports = {
  checkEmptyInput,
  checkDuplicateUsernameOrEmailAndMatchedPassword,
};
