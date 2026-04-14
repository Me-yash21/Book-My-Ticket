import nodemailer from "nodemailer";

// console.log(__dirname)
// Create a transporter using SMTP

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER ,
        pass: process.env.SMTP_PASS ,
    },
});


const sendVerificationEmail = async (email,token) => {

    try {
    const info = await transporter.sendMail({
            from: '"Ballon Auth" <no-reply@ballon.com>', 
            to: email,
            subject: "Ballon: Email verification",
            text: `Click here to verify your ${process.env.FRONTEND_DOMAIN}/verify?token=${token} `,
            html: `
            <h1>Verify your Email</h1>
            <br/>
            <p><a href="${process.env.FRONTEND_DOMAIN}/verify?token=${token}">Click here</a> to verify your Account</p>
            `,
        });

    } catch(err) {
        console.error("Error while sending mail:", err);
    }

}

const sendForgotPasswordEmail = async (email,token) => {

    try {
    const info = await transporter.sendMail({
            from: '"Ballon Auth" <no-reply@ballon.com>', 
            to: email,
            subject: "Password Reset ",
            text: `click here to reset your password ${process.env.FRONTEND_DOMAIN}/reset?token=${token} `,
            html: `
            <h1>Reset your password</h1>
            <br/>
            <p><a href="${process.env.FRONTEND_DOMAIN}/reset?token=${token}">Click here</a> to verify your Account</p>
            `,
        });

    } catch(err) {
        console.error("Error while sending mail:", err);
    }

}

export {sendVerificationEmail,sendForgotPasswordEmail}