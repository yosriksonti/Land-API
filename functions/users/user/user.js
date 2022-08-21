/**
 * builds a User Maker
 * @exports buildMakeUser 
 * @returns {function}  - User Maker
 */
module.exports =  function buildMakeUser ({ 
}) {
  return function makeUser ({
    id = "",
    name,
    surname,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
    email,
    image = "https://firebasestorage.googleapis.com/v0/b/test-e07e2.appspot.com/o/images%20%2Fuser%2F117445494_724340838136316_3715804756585211562_n.png?alt=media&token=ae41f6be-da1e-43aa-b40d-81facfd07c57",
    password,
    newPassword,
    phoneNumber,
    role,
    token,
    active = true,
    type,
    action
  } = {}) {
    if(!action){
      throw new Error('User Action required.')        
    }
    else {
      switch(action){
        case "postUser" : {
          if (!name) {
            throw new Error('User must have a name.')
          }
          if (name.length < 3) {
            throw new Error("User's name  must be longer than 2 characters.")
          }
          if (!surname) {
            throw new Error('User must have a surname.')
          }
          if (surname.length < 3) {
            throw new Error("User's surname name must be longer than 2 characters.")
          }
          if (!email) {
            throw new Error('User must have a email.')
          }
          if (email.length < 3) {
            throw new Error("User's email name must be longer than 2 characters.")
          }
          if (!role) {
            throw new Error('User must have a role.')
          }
          if (role.length < 3) {
            throw new Error("User's role name must be longer than 2 characters.")
          }
          if (!password) {
            throw new Error('User must have a password.')
          }
          if (password.length < 3) {
            throw new Error("User's password must be longer than 2 characters.")
          }
          if (!phoneNumber) {
            throw new Error('User must have a phone Number.')
          }
          if (phoneNumber.length < 8) {
            throw new Error("User's phone Number must be longer than 7 characters.")
          }
          if (isNaN(phoneNumber)) {
            throw new Error("User's phone Number must contain Numbers Only.")
          }
          if (!type) {
            throw new Error('User must have a type.')
          }
          if (type.length < 3) {
            throw new Error("User's type name must be longer than 2 characters.")
          }
          
          
         
          return Object.freeze({
            getId: () => id,
            getName: () => name,
            getCreatedOn: () => createdOn,
            getModifiedOn: () => modifiedOn,
            getSurname: () => surname,
            getEmail: () => email,
            getActive: () => active,
            getImage: () => image,
            getPassword: () => password,
            getPhoneNumber: () => phoneNumber,
            getRole: () => role,
            getType: () => type,
            activate: () => {
              active = true
            },
            deActivate: () => {
              active = false
            }
          })
        }
      
        case "putUser": {
          if (!id) {
            throw new Error('User must have an Id.')
          }
          if (!name) {
            throw new Error('User must have a name.')
          }
          if (name.length < 3) {
            throw new Error("User's name  must be longer than 2 characters.")
          }
          if (!surname) {
            throw new Error('User must have a surname.')
          }
          if (surname.length < 3) {
            throw new Error("User's surname name must be longer than 2 characters.")
          }
          if (!image) {
            throw new Error('User must have Image.')
          }
          if (!token || token.length < 50) {
            throw new Error('User must have a Valid Token.')
          }
          return Object.freeze({
            getId: () => id,
            getName: () => name,
            getModifiedOn: () => modifiedOn,
            getSurname: () => surname,
            getImage: () => image,
            getToken: () => token
          })
        }

        case "postLogin": {
          if (!email) {
            throw new Error('User must have a email.')
          }
          if (email.length < 3) {
            throw new Error("User's email name must be longer than 2 characters.")
          }
          if (!password) {
            throw new Error('User must have a password.')
          }
          if (password.length < 3) {
            throw new Error("User's password must be longer than 2 characters.")
          }
          return Object.freeze({
            getPassword: () => password,
            getEmail: () => email
          })
        }

        case "postReset": {
          if (!email) {
            throw new Error('User must have a email.')
          }
          if (email.length < 3) {
            throw new Error("User's email name must be longer than 2 characters.")
          }
          return Object.freeze({
            getEmail: () => email
          })
        }

        case "putPassword": {
          if (!id) {
            throw new Error('User must have an Id.')
          }
          if (!email) {
            throw new Error('User must have a email.')
          }
          if (email.length < 3) {
            throw new Error("User's email name must be longer than 2 characters.")
          }
          if (!password) {
            throw new Error('User must have a password.')
          }
          if (password.length < 3) {
            throw new Error("User's Password must be longer than 2 characters.")
          }
          if (!newPassword || newPassword.length < 3) {
            throw new Error('User must have a Valid New Password.')
          }
          if (!token || token.length < 3) {
            throw new Error('User must have a Valid Token.')
          }
          return Object.freeze({
            getId: () => id,
            getEmail: () => email,
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
