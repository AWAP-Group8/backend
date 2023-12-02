const nodemailer = require('nodemailer');
const sendMail = (to, sendText) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: '13432716851@163.com',
        pass: 'JKDZOFXAPGBPOPHM'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const mailOptions = {
      from: '13432716851@163.com',
      to,
      subject: "Your parcel has arrived",
      html: "Your parcel has arrived, pickup code is <b style='color:skybkue;'>" + sendText + "</b>.",
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(info)
        resolve(info)
      }
    })
  })
}

module.exports = {
  sendMail
}
