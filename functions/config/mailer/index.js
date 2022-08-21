const  nodemailer = require('nodemailer')
module.exports =  async function getMailer() {
  let mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'w311940@gmail.com',
      pass: 'bechwlxdlxznvumy'
    }
  });
  return mailer
}