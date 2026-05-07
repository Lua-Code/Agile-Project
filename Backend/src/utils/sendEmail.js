import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "AlaskanStateUniversity@gmail.com",
    pass: "jdsummvecmtnlvbb",
  },
    tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: "AlaskanStateUniversity@gmail.com",
    to,
    subject,
    text,
  });
};