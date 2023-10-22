const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const { SECRET_KEY } = process.env;
const {
  User,
  userSignUpValidate,
  userLogInValidate,
} = require("../models/user");
const { verifyValidate } = require("../models/user");
const { sendEmail, verificationLetter } = require("../helpers/");
const { UserCollection } = require("../models/userCollection");

const appLink = "https://floss.vercel.app";
// const appLink = "http://localhost:3000";

const signup = async (req, res, next) => {
  const { error } = userSignUpValidate.validate(req.body);

  try {
    if (error) {
      throw new Error(error.message);
    }

    const { login, email } = req.body;
    const isUser = await User.findOne({ email });
    if (isUser) {
      throw new Error("Email in use");
    }
    const hashPassword = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );
    const password = hashPassword;
    const avatarURL = gravatar.url(email);
    const verificationToken = v4();
    const user = await User.create({
      email,
      password,
      login,
      avatarURL,
      verificationToken,
    });

    await UserCollection.create(
      {
        email,
        owner: user._id,
        flossCollection: [],
        schemaCollection: [],
        wishList: [],
      },
      { versionKey: false, timestamps: true }
    );

    await sendEmail(verificationLetter(email, verificationToken, appLink));

    res.status(201).json({
      user: {
        email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
        linkToVerify: `${appLink}/Verification#${verificationToken}`,
      },
    });
  } catch (e) {
    res.status(409).json({ message: e.message });
  }
};

const emailCheck = async (req, res, next) => {
  const { email } = req.body;
  try {
    const verificationToken = v4();
    await sendEmail(verificationLetter(email, verificationToken, appLink));
    //  console.log(email, verificationToken, appLink)
    res.status(201).json({
      user: {
        email,
        linkToVerify: `${appLink}/Verification#${verificationToken}`,
      },
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
};

const login = async (req, res, next) => {
  const { error } = userLogInValidate.validate(req.body);

  try {
    if (error) {
      throw new Error(error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Email or password is wrong");
    }

    if (!user.verify) {
      throw new Error(`Email is not verify`);
    }

    const collection = await UserCollection.findOne({ owner: user._id });
    const collectionId = collection._id;
    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        login: user.login,
        email: user.email,
        collectionId: collectionId,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });

    res.status(204).json();
  } catch (e) {
    res.status(400).json({ message: "Not found" });
    next(e);
  }
};

const current = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  const { login, email, subscription, _id } = req.user;
  const token = jwt.sign({ id: _id }, SECRET_KEY, {
    expiresIn: "1h",
  });
  await User.findByIdAndUpdate(_id, { token });
  const collection = await UserCollection.findOne({ owner: _id });
  const collectionId = collection._id;
  res.status(200).json({
    status: "succes",
    code: 200,
    data: {
      token,
      user: {
        _id: _id,
        collectionId,
        login,
        email,
        subscription,
      },
    },
  });
};

const avatars = async (req, res, next) => {
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");
  const imageName = `${req.user.id}_${req.file.originalname}`;
  const resultUpload = path.join(avatarsDir, imageName);
  const avatarURL = path.join("public", "avatars", imageName);
  const tempUpload = req.file.path;

  try {
    Jimp.read(tempUpload, (error, avatar) => {
      if (error) {
        res.status(401).json({
          message: "unsupported file",
        });
        throw error;
      }

      avatar
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .write(resultUpload); // save
    });

    await fs.rename(tempUpload, resultUpload);
    await User.findByIdAndUpdate(req.user.id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    res.status(401).json({
      message: "Not authorized",
    });
  }
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  try {
    if (!user) {
      throw new Error(`Somthing wrong, verification link is wrong`);
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({
      message: `User ${user.email} is verify`,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const resendVerify = async (req, res, next) => {
  const email = req.body.email;
  // console.log(req);
  const { error } = verifyValidate.validate({ email });
  if (error) {
    res.status(400).json(error.message);
    next(error.message);
  }
  try {
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      throw new Error(`Email: "${email}" is not registered yet`);
    }
    if (user.verify) {
      throw new Error("Verification has already been passed");
    }

    await sendEmail(verificationLetter(email, user.verificationToken, appLink));
    res.status(200).json({
      message: "Verification mail is send again",
      linkToVerify: `${appLink}/Verification#${user.verificationToken}`,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
  verify,
  resendVerify,
  emailCheck,
};
