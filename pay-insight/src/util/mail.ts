import nodemailer from "nodemailer";
import User from "@/model/user";
import { randomUUID } from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: true, // use SSL
  port: 465, // use the appropriate port
} as nodemailer.TransportOptions);

async function mail({
  address,
  subject,
  text,
  html,
}: {
  address: string;
  subject: string;
  text: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: "Rinku Kumar 👻<rinkukumar412616@gmail.com>", // sender address
      to: address, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
}

export const createMailSystem = async ({
  address,
  type,
  _id,
}: {
  address: string;
  type: string;
  _id: string;
}) => {
  try {
    const token = randomUUID();
    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
    const user = await User.findByIdAndUpdate(_id, {
      [`${type}Token`]: token, // generate a random token
      [`${type}TokenExpire`]: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    if (type === "verify") {
      const html = `<a href="${DOMAIN}/verify?TOKEN=${token}">Click here to verify your email</a>`;
      const text = `${user.username}, please click the link below to verify your email: ${DOMAIN}/verify?TOKEN=${token}`;
      const subject = "Verify your email";
      await mail({ address, subject, text, html });
    } else if (type === "reset") {
      const html = `<a href="${DOMAIN}/reset?TOKEN=${token}">Click here to reset your password</a>`;
      const text = `${user.username}, please click the link below to reset your password: ${DOMAIN}/reset?TOKEN=${token}`;
      const subject = "Reset your password";
      await mail({ address, subject, text, html });
    }
  } catch (error) {
    console.error("Error in createMailSystem:", error);
  }
};
