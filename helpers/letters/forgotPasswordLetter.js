const forgotPasswordLetter = (email, user, appLink) => {
    return {
      to: email,
      subject: "Change password letter",
      html: `<tabel ><tr><td align="center"><a href="https://floss.vercel.app/" style="text-decoration: none;">
      <img width="20%" src="https://i.ibb.co/FJC9JK2/icon1.png" alt="Floss app logo" border="0"></a> </td></tr>
      <tr><td style="text-align:center; font-size: 16px">
      <h3 style="font-size: 20px">Hello!</h3>
      <p style="margin: 5px; ">This is a letter from the <span style="font-weight: 600">Floss</span> app</p>
      <p style="margin: 5px;">You received this message because you forgot your password and want to log into the application</p>
      <p style="margin: 5px;"> Click the button below to log into the app.
      If it wasn't you please ignore this email</p></td></tr>
      <tr><td align="center"><button style="background-color: rgb(139, 214, 233); border: none; border-radius: 5px; color: black; cursor: pointer"><a target="_blank" href="${appLink}/PasswordPage#${user.token}" style="color: #000000 ; text-decoration: none; padding: 5px 10px; display: block">Confirm</a></button></td></tr>
      <tr><td style="text-align:center; font-size: 16px"><p style="margin: 5px; "> Please change the password after you'we been logged in by</p>
      <p> use this temporarry password. It is valid 1 day </p> 
      <p> <span style="font-weight: 600; font-size: 18px">${user.temporaryCode}</span> </p>
      <p>the letter is valid once for 2 hour. Then you will need to go through the procedure again</p></td></tr>
      
      </tabel>`,
    };
  };
  module.exports = forgotPasswordLetter;