/**
 * builds a Admin Maker
 * @exports buildMakeAdmin 
 * @returns {function}  - Admin Maker
 */
module.exports = function buildMakeAdmin ({ 
}) {
  return function makeAdmin ({
    id = "",
    uid,
    login,
    mail,
    password,
    newPassword,
    phoneNumber,
    role,
    token,
    active = true,
    action
  } = {}) {
    if(!action){
      throw new Error('Admin Action required.')        
    }
    else {
      switch(action){
        case "postAdmin" : {
          if (!login) {
            throw new Error('Admin must have a login.')
          }
          if (login.length < 3) {
            throw new Error("Admin's login  must be longer than 2 characters.")
          }
          if (!mail) {
            throw new Error('Admin must have a mail.')
          }
          if (!role) {
            throw new Error('Admin must have a role.')
          }
          if (mail.length < 3) {
            throw new Error("Admin's mail login must be longer than 2 characters.")
          }
          if (!password) {
            throw new Error('Admin must have a password.')
          }
          if (password.length < 3) {
            throw new Error("Admin's password must be longer than 2 characters.")
          }
          if (!phoneNumber) {
            throw new Error('Admin must have a phone Number.')
          }
          if (phoneNumber.length < 8) {
            throw new Error("Admin's phone Number must be longer than 7 characters.")
          }
          if (isNaN(phoneNumber)) {
            throw new Error("Admin's phone Number must contain Numbers Only.")
          }
          
          
         
          return Object.freeze({
            getId: () => id,
            getUid: () => uid,
            getLogin: () => login,
            getMail: () => mail,
            getActive: () => active,
            getPassword: () => password,
            getPhoneNumber: () => phoneNumber,
            getRole: () => role,
            activate: () => {
              active = true
            },
            deActivate: () => {
              active = false
            }
          })
        }

      
        case "putAdmin": {
          if (!id) {
            throw new Error('Admin must have an Id.')
          }
          if (!login) {
            throw new Error('Admin must have a login.')
          }
          if (login.length < 3) {
            throw new Error("Admin's login  must be longer than 2 characters.")
          }
          if (!token || token.length < 50) {
            throw new Error('Admin must have a Valid Token.')
          }
          return Object.freeze({
            getId: () => id,
            getLogin: () => login,
            getToken: () => token
          })
        }
        
        case "deleteAdmin": {
          if (!id) {
            throw new Error('Admin must have an Id.')
          }
          if (!token || token.length < 50) {
            throw new Error('Admin must have a Valid Token.')
          }
          return Object.freeze({
            getId: () => id,
            getUid: () => uid,
            getToken: () => token
          })
        }

        case "postLogin": {
          if (!mail) {
            throw new Error('Admin must have a mail.')
          }
          if (mail.length < 3) {
            throw new Error("Admin's mail login must be longer than 2 characters.")
          }
          if (!password) {
            throw new Error('Admin must have a password.')
          }
          if (password.length < 3) {
            throw new Error("Admin's password must be longer than 2 characters.")
          }
          return Object.freeze({
            getPassword: () => password,
            getMail: () => mail
          })
        }
        case "deactivateAdmin": {

          return Object.freeze({
            deActivate: () => {
              active = false
            }
          })
        }

        case "postReset": {
          if (!mail) {
            throw new Error('Admin must have a mail.')
          }
          if (mail.length < 3) {
            throw new Error("Admin's mail login must be longer than 2 characters.")
          }
          return Object.freeze({
            getMail: () => mail
          })
        }

        case "putPassword": {
          if (!id) {
            throw new Error('Admin must have an Id.')
          }
          if (!mail) {
            throw new Error('Admin must have a mail.')
          }
          if (mail.length < 3) {
            throw new Error("Admin's mail login must be longer than 2 characters.")
          }
          if (!password) {
            throw new Error('Admin must have a password.')
          }
          if (password.length < 3) {
            throw new Error("Admin's Password must be longer than 2 characters.")
          }
          if (!newPassword || newPassword.length < 3) {
            throw new Error('Admin must have a Valid New Password.')
          }
          if (!token || token.length < 3) {
            throw new Error('Admin must have a Valid Token.')
          }
          return Object.freeze({
            getId: () => id,
            getMail: () => mail,
            getPassword:() => password,
            getNewPassword:() => newPassword,
            getToken:() => token
          })
          
        }
        default: {
          throw new Error("Invalid Action.");
        }
      }
    }
  }

}
