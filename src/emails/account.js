const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    form: process.env.SENDER_EMAIL,
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    form: process.env.SENDER_EMAIL,
    subject: 'Sorry to see you go!',
    text: `Goodbye ${name}, We hope to see you back soon.`,
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
}
