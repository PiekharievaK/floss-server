const verificationLetter = (email, verificationToken, appLink ) => {

  return {
    to: email,
    subject: "Подтверждение email",
    html: `<a target="_blank" href="${appLink}/users/verify/${verificationToken}"> Подтвердить email </a>`,
  };
};
module.exports = verificationLetter;
