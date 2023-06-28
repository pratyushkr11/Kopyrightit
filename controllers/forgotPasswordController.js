// const User = require("../model/User");
// const nodemailer = require("nodemailer");
// const jwt = require("jsonwebtoken");
// const randomstring = require("randomstring");

// const sendResetPasswordMail = async (res, req) => {

//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.HOST,
//             port: process.env.EMAIL_PORT,
//             secure: false,
//             requireTLS: true,
//             auth: {
//                 user: process.env.USER,
//                 pass: process.env.PASS
//             }
//         });

//         const mailOptions = {
//             from: process.env.USER,
//             to: email,
//             subject: 'Password Reset Link',
//             html: ''
//         }
//     } catch (error) {
//         res.status(400).send({ 'message': err.message })
//     }
// }

// const forgetPassword = async (req, res) => {
//     try {
//         const email = req.body.email;
//         const userData = await User.findOne({ email: email });

//         if (userData) {
//             const randomString = randomstring.generate();
//             const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
//             res.status(200).send({ success: true, msg: "An email with password reset link has been sent to your mail" });
//         }
//     } catch (error) {

//     }
// }