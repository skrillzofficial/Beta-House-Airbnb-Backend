const nodemailer = require("nodemailer");
const {createResetTemplate, createWelcomeTemplate} = require("./emailTemplate")


const sendMail = async({to, subject, html})=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    })
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            html: html,
        })
        console.log(`email sent ${info.response}`);
    } catch (error) {
        console.log(error);
    }
}

// function to send an email
const sendWelcomeEmail = ({fullName, clientUrl, email}) => {
    const subject = "Welcome to the awesome BetaHouse"
    const html = createWelcomeTemplate(fullName, clientUrl)
    sendMail({to: email, subject, html})
}

// function to send a password reset email
const sendResetEmail = ({fullName, clientUrl, email}) => {
    const subject = "Password Reset"
    const html = createResetTemplate(fullName, clientUrl)
    sendMail({to: email, subject, html})
}

module.exports = {sendWelcomeEmail, sendResetEmail}