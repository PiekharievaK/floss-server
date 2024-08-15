const bcrypt = require("bcrypt");
const { UserCollection } = require("../models/userCollection");
const { User } = require("../models/user");

const getProfileData = async (req, res, next) => {
  const { user } = req;
  console.log(user);
  try {
    const collection = await UserCollection.findOne({ owner: user._id });
    const profileData = {
      email: user.email,
      login: user.login,
      avatar: user.avatarURL,
      createdAt: user.createdAt ? user.createdAt : user._id.getTimestamp(),
      flosses: collection.flossCollection.length,
      schemas: collection.schemaCollection.length,
      wishList: collection.wishList.length,
    };

    res.status(200).json(profileData);
  } catch (e) {
    console.log(e.message);
    res.status(204).json({ message: "No data" });
    next(e);
  }
};

const checkPassword = async (req, res, next) => {
  const { user } = req;
  const CheckingPassword = req.body.password;
  // console.log(req.user, CheckingPassword, );

  try {
    const isPassswordTrue = bcrypt.compareSync(CheckingPassword, user.password);
    console.log(isPassswordTrue);

    if (isPassswordTrue === true) {
      res.status(200).json(isPassswordTrue);
      return
    } else if (!isPassswordTrue && CheckingPassword !== user.temporaryCode) {
      throw new Error("Your password or temporary code is wrong");
    } else if (!isPassswordTrue && CheckingPassword === user.temporaryCode) {
      console.log("TemporraryCode");
      const codeTime = parseInt(CheckingPassword, 16);
      const DateNow = Date.now();
      const isCodeFresh = DateNow <= codeTime;
      console.log(codeTime, DateNow, isCodeFresh);
      if (isCodeFresh === true) {
        res.status(200).json(isCodeFresh);
        return
      } else 
      console.log(DateNow <= 1717972288722, DateNow >= 1717972288722 );
      throw new Error("Your temporary code is expired");
    }
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
};

const resetPassword = async (req, res, next) => {
  const { user } = req;
  console.log(user);
  const newPassword = "random password";
  try {
    const userData = await User.findByIdAndUpdate(user._id, {
      pasword: newPassword,
    });

    res.status(200).json(userData);
  } catch (e) {
    console.log(e.message);
    res.status(204).json({ message: "No data" });
  ;
  }
};

const changePassword = async (req, res, next) => {
  const { user } = req;
  const password = req.body.password
  console.log(password);
  try {
    const hashPassword = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );
    const newPassword = hashPassword;
console.log(newPassword);

    // const userData = await User.findByIdAndUpdate(user._id, {
    //   pasword: newPassword,
    // });

    res.status(200).json('userData');
  } catch (e) {
    console.log(e.message);
    res.status(204).json({ message: "No data" });
    next(e);
  }
};

const changeLogin = async (req, res, next) => {
  const { user, newLogin } = req;
  console.log(user);
  try {
    const userData = await User.findByIdAndUpdate(user._id, {
      login: newLogin,
    });

    res.status(200).json(userData);
  } catch (e) {
    console.log(e.message);
    res.status(204).json({ message: "No data" });
    next(e);
  }
};
module.exports = {
  getProfileData,
  checkPassword,
  resetPassword,
  changePassword,
  changeLogin,
};
