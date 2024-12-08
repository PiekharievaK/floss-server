const temporarryPasswordLetter = (email, temporaryPassword, appLink) => {
    return {
      to: email,
      subject: "Change password letter",
      html: `<tabel ><tr><td align="center"><a href="https://floss.vercel.app/" style="text-decoration: none;">
      <img width="20%" src="https://i.ibb.co/FJC9JK2/icon1.png" alt="Floss app logo" border="0"></a> </td></tr>
      <tr><td style="text-align:center; font-size: 16px">
      <h3 style="font-size: 20px">Hello!</h3>
      <p style="margin: 5px; ">This is a letter from the <span style="font-weight: 600">Floss</span> app</p>
      <p style="margin: 5px; "> You received this email because you requested to reset your profile password</p>
      <p style="margin: 5px;">Your temporary password is:</p>
      <h4 style="margin: 5px;"> ${temporaryPassword} </h4></td></tr>
      <tr><td><h4 style="margin: 5px;"> Please change your password on your profile page after logging in </h4></td></tr>
      </tabel>`
    };
  };
  module.exports = temporarryPasswordLetter;