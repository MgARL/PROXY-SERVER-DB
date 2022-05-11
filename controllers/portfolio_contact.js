// dependencies
const contact = require('express').Router()
const nodemailer = require('nodemailer')
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

contact.post('/send-form', async (req, res) => {
    const { name, email, subject, message } = req.body 
    try {
        if(name && email && subject && message){
            const response = await transporter.sendMail({
                from: email,
                to: RECEIVER,
                subject: subject,
                text: `message: ${message} | from: ${name} | email: ${email}`
            })
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

module.exports = contact