// dependencies
const contact = require('express').Router();
const nodemailer = require('nodemailer');
require('dotenv').config()

// ENV VARS
const { SERVICE, EMAIL_USER, PASS, RECEIVER } = process.env

// Transporter Set Up
const transporter = nodemailer.createTransport({
    service: SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: PASS
    }
})

const createTemplate = (name, email, subject, message) => {
    let template = `<h3>From:<strong> ${name}</strong></h3><br/>`;
    template+= `<h3>At:<a href="mailto:${email}"> ${email}</a></h3><br/>`;
    template += `<h3>Subject: ${subject}</h3><br/>`
    template += `<p>${message}</p>`;
    return template;
};

contact.post('/send-form', async (req, res) => {
    const { name, email, subject, message } = req.body
    try {
        if(name && email && subject && message){
            const body = {
                from: email,
                to: RECEIVER,
                subject: subject,
                html: createTemplate(name, email, subject, message)
            };
            const response = await transporter.sendMail(body);
            console.log(response)
            res.status(200).json({
                message: 'message sent'
            })
        }else{
            res.status(400).json({
                message: 'please enter valid information'
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = contact;