import nodemailer from "nodemailer";
import User from "../model/user.js";
import { randomUUID } from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapperaddress
async function mail({ address, subject, text, html }) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "sohil khan 👻<spk612000@gmail.com>", // sender address
    to: address, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export const createMailSystem = async ({ address, type, _id }) => {
  const token = randomUUID();
  const DOMAIN = process.env.DOMAIN || "http://localhost:5173";
  const user = await User.findByIdAndUpdate(_id, {
    [`${type}Token`]: token, // generate a random token
    [`${type}TokenExpire`]: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });
  if (type === "verify") {
    const html = `<a href="${DOMAIN}/verify?TOKEN=${token}">Click here to verify your email</a>`;
    const text = `${user.username}, please click the link below to verify your email: ${DOMAIN}/verify?TOKEN=${token}`;
    const subject = "Verify your email";
    await mail({ address, type, _id, subject, text, html });
  } else if (type === "reset") {
    const html = `<a href="${DOMAIN}?reset/TOKEN=${token}">Click here to reset your password</a>`;
    const text = `${user.username}, please click the link below to reset your password: ${DOMAIN}/reset?TOKEN=${token}`;
    const subject = "Reset your password";
    await mail({ address, type, _id, subject, text, html });

  }
};

// mail().catch(console.error);
