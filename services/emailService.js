import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sjchaconballadares@gmail.com',
        pass: 'jkxw bnze gmvj iyul'
    }
});

export const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: 'sjchaconballadares@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo: ', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};
