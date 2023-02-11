const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = process.env;

const sendEmail = async (data) => {
  sgMail.setApiKey(SENDGRID_API_KEY);
  const email = { ...data, from: "pechareva@gmail.com" };
  try {
    await sgMail.send(email);
    console.log("send is success");
    return true;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

module.exports = sendEmail;
