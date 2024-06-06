import User from "@/model/user.model";
import nodemailer from "nodemailer";
import { v4 } from "uuid";

export const sendemail = async ({ email, emailType, userId }: any) => {
  const token = v4();
  try {
    let subject, html, action;

    switch (emailType) {
      case "changepassword":
        subject = "Password Change Successfully";
        html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            /* Your CSS styles here */
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Change Successfully</h1>
            <p>Thank you for joining us. We're excited to have you on board!</p>
            <p>Click the button below to get started.</p>
            <a href="${process.env.DOMAIN}/login" class="button">Get Started</a>
          </div>
        </body>
        </html>
      `;
        break;
      case "welcome":
        subject = "Welcome to Our Platform!";
        html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            /* Your CSS styles here */
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Our Platform!</h1>
            <p>Thank you for joining us. We're excited to have you on board!</p>
            <p>Click the button below to get started.</p>
            <a href="${process.env.DOMAIN}/" class="button">Get Started</a>
          </div>
        </body>
        </html>
      `;
        break;
      case "verification":
        await User.findByIdAndUpdate(
          userId,
          {
            verifytoken: token,
            verifytokenexpiry: Date.now() + 3600000,
          },
          { new: true }
        );
        subject = "Account Verification";
        action = "verify your account";
        html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            /* Your CSS styles here */
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Account Verification</h1>
            <p>Please click the following link to ${action}:</p>
            <a href="${process.env.DOMAIN}/verifyemail?token=${token}" class="button">${action}</a>
            <p>If the link does not work, please copy and paste it into your browser's address bar:</p>
            <p>${process.env.DOMAIN}/verifyemail?token=${token}</p>
          </div>
        </body>
        </html>
      `;
        break;
      case "resetPassword":
        await User.findByIdAndUpdate(
          userId,
          {
            forgetpasswordtoken: token,
            forgetpasswordtokenexpiry: Date.now() + 3600000,
          },
          { new: true }
        );
        subject = "Password Reset";
        action = "reset your password";
        html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            /* Your CSS styles here */
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset</h1>
            <p>Please click the following link to ${action}:</p>
            <a href="${process.env.DOMAIN}/changepassword?token=${token}" class="button">${action}</a>
            <p>If the link does not work, please copy and paste it into your browser's address bar:</p>
            <p>${process.env.DOMAIN}/changepassword?token=${token}</p>
          </div>
        </body>
        </html>
      `;
        break;
      default:
        throw new Error("Invalid email type");
    }
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!), // Ensure the port is a number
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailoption = {
      from: "Varun@kainth.ai",
      to: email,
      subject: subject,
      html: html,
    };

    const mailResponse = await transport.sendMail(mailoption);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
