const sendEmail = require("./sendEmail");
const {verificationLetter, resetPasswordLetter, forgotPasswordLetter,} = require("./letters");

module.exports = {
  sendEmail,
  verificationLetter,
  forgotPasswordLetter,
  resetPasswordLetter
};
