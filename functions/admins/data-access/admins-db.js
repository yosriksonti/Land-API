/**
 * Makes a Admins Data Access
 * @param {function} makeDb -DataBase Connection Maker
 * @param {function} makeAuth -Admin Connection Maker
 * @param {function} firebase -Firebase Connection
 * @param {function} jwt -JSON Web Token Module
 * @param {function} cryspto -Crypting Module
 * @exports makeAdminsDb 
 * @returns {Object}  - Admins Data Access Frozen Object
 */
module.exports =  function makeAdminsDb ({ makeDb, makeAuth, firebase, jwt, crypto}) {
  return Object.freeze({
    findAll,
    findById,
    findByEmail,
    exists,
    insert,
    login,
    update,
    updatePassword,
    reset,
    deactivateAdmin,
    deleteAdmin,
  })
  async function findAll () {
    const db = makeDb()
    const data = [];
    const result = await db.collection('admins').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            data.push({
                id: doc.id,
                body: doc.data()
            });
        });
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    return data;
  }
  async function findById ({ Id: _id }) {
    const db = makeDb()
    const data = [];
    const docID=String(_id);
    console.log(_id);
    const result = await db.collection('admins').doc(docID).get().then(function(doc) {
      if (doc.exists) {
        console.log(doc.id, " => ", doc.data());
        data.push({
        id: doc.id,
        body: doc.data()
        });
      } else {
          throw (new Error("Admin does NOT exist."))
      }
      
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    return data;
  }

  async function findByEmail (mail) {
    const db = makeDb()
    var exists = false
    console.log(mail);
    const result = await db.collection('admins').where("mail", "==", mail).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          exists = {id: doc.id, body: doc.data()};
      });
    }).catch(function(error) {
      throw (new Error(error))
    });
    if(!exists) {
      throw new Error("Email is NOT used.")
    }
    return exists;
  }

  async function findLoginByEmail (mail) {
    const db = makeDb()
    var exists = false
    console.log(mail);
    const result = await db.collection('logins').where("mail", "==", mail).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          exists = {id: doc.id, body: doc.data()};
      });
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    if(!exists) {
      throw new Error("Email is NOT used.")
    }
    return exists;
  }
  async function exists (mail) {
    const db = makeDb()
    var exists = false
    console.log(mail);
    const result = await db.collection('logins').where("mail", "==", mail).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        throw new Error("Email already Used.")
      });
      
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    console.log(exists)
    return exists;
  }
  //good
  async function insert ({ ...adminInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(adminInfo)
    return getAdmin(adminInfo).then((result) => {
      return firebase.auth().createUserWithEmailAndPassword(result.body.mail, result.body.password).then((resp) => {
        resp.user.sendEmailVerification().then(()  => {}).catch(error => {
          throw new Error(error)
        })
        return db.collection('admins').add({
          uid: resp.user.uid,          
          login: result.body.login,
          mail: result.body.mail,
          phoneNumber: result.body.phoneNumber,
        }).then((respond) => { 
          return auth.setCustomUserClaims(
            resp.user.uid, 
            {
              role: result.role, 
              id: respond._path.segments[1]  
            }
          ).then(() => {
            return { 
              id: respond._path.segments[1],
              body: result.body 
            }
          })
          .catch((error) => {
              throw (new Error(error))
          })
        }).catch(function(error) {
            throw (new Error(error))
        });
      }).catch(function(error) {
          throw (new Error(error))
      });
    }).catch(function(error) {
        throw (new Error(error))
    })
  }

  async function insert_alt ({ ...adminInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(adminInfo)
    return getAdmin(adminInfo).then((result) => {
      return exists(result.body.mail).then(() => {
        return db.collection('admins').add({
          login: result.body.login,
          password: result.body.password ,
          newPassword: result.body.newPassword,
          modifiedOn: result.body.modifiedOn,
          mail: result.body.mail,
          phoneNumber: result.body.phoneNumber,
          active: result.body.active
        }).then((resp) => {
          const password = crypt(adminInfo.password, "e", crypto) 
          return db.collection('logins').add({
            mail: adminInfo.mail,
            password: password,
            newPassword: adminInfo.newPassword,
            modifiedOn: adminInfo.modifiedOn,
            role: adminInfo.role,
            uid: resp._path.segments[1]
          }).catch(function(error) {
              console.log(result.body.mail)
              throw (new Error(error))
          });
        }).catch(function(error) {
            throw (new Error(error))
        });
      })
    }).catch(function(error) {
        throw (new Error(error))
    })
  }

  
  async function login ({...adminInfo}) {
    return firebase.auth().signInWithEmailAndPassword(adminInfo.mail, adminInfo.password).then(function(resp){
      if(resp.user.emailVerified === true){
        return findByEmail(adminInfo.mail).then((result) => {
          return firebase.auth().currentUser.getIdToken(true).then((token) => {
            return {
              uid: result.uid,
              id: result.id, 
              body: result.body, 
              token: token
            }
          })   
       }).catch(function(error) {
          throw (new Error(error))
       })
      } else {
        throw new Error("This User is NOT active.")
      }
    }).catch(function(error) {
        throw (new Error(error))
    });
  }

  async function login_alt ({...adminInfo}) {
      return findLoginByEmail(adminInfo.mail).then((resp) => {
        if(adminInfo.password === crypt(resp.body.password, "d", crypto)){
          return findByEmail(adminInfo.mail).then((result) => {
            if(result.body.active){
              const token = getAdminToken({id: resp.id, uid: result.id, mail: resp.body.mail, role: resp.body.role}, jwt)
              return {
                id: result.id,
                body: result.body, 
                token: token
              }
            } else {
              throw (new Error("This Admin is NOT active."))
            }
          }).catch((error) => {
            throw new Error("Admin does NOT exist.")
          }) 
        } else {
          throw new Error("Check your Credentials.")
        }           
      }).catch((error) => {
        throw new Error(error)
      })
    //catch ( auth )  
  }

  async function reset ({...adminInfo}) {  
    const auth = firebase.auth()
    return getAdmin(adminInfo).then((result) => {
      return auth.sendPasswordResetEmail(result.body.mail).then(() => {
        return "Email Sent."
      }).catch(function(error) {
        throw new Error(error)
      })
    }).catch((error) => {
      throw new Error(error)
    })    
  }

  async function updatePassword ({...adminInfo}) {  
    const auth = makeAuth()
    return getAdmin(adminInfo).then((result) => {
      return firebase.auth().signInWithEmailAndPassword(result.body.mail, result.body.password).then(function(){
        return auth.verifyIdToken(result.token).then((resp) => {
          if (resp.id === result.id){
            return auth.updateAdmin(resp.uid, {
              password: result.body.newPassword
            }).then(function(adminRecord) {
              return adminRecord.toJSON()
            }).catch(function(error) {
              throw new Error(error)
            });
          } else {
            throw new Error("Token does NOT match the Id.")
          }
        }).catch((error) => {
          throw new Error(error)
        })
      }).catch((error) => {
        throw new Error(error)
      })
    }).catch((error) => {
      throw new Error(error)
    })    
  }
  async function updatePassword_alt ({...adminInfo}) {  
    const db = makeDb()
    return getAdmin(adminInfo).then((result) => {
      if( validateToken(result.token, jwt).uid == result.id ) {
        const password = crypt(result.body.newPassword, "e", crypto) 
        return db.collection('logins').where("uid","==",result.id).set({
          password: password
        },
        { 
          merge : true 
        }).catch((error) => {
          throw (new Error(error))
        })
      }else{
        throw (new Error("Token does NOT match the ID."))
      }
    }).catch((error) => {
      throw new Error(error)
    })    
  }
  async function update ({ ...adminInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(adminInfo)
    return getAdmin(adminInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      return auth.verifyIdToken(result.token).then((resp) => {
        if(result.id == resp.id) {
          return db.collection('admins').doc(docID).update({
            login: result.body.login,
            password: result.body.password,
            modifiedOn :result.body.modifiedOn
          }).catch((error) => {
              throw (new Error(error))
          })
        } else {
            throw (new Error("Token does NOT match the ID."))
        }
      }).catch(function(error) {
          throw (new Error(error))
      })
    })
  }
  async function deactivateAdmin ({ ...adminInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(adminInfo)
    return getAdmin(adminInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      return auth.verifyIdToken(result.token).then((resp) => {
        if(result.id == resp.id) {
          return db.collection('admins').doc(docID).update({
            active: result.body.active,
          }).catch((error) => {
              throw (new Error(error))
          })
        } else {
            throw (new Error("Token does NOT match the ID."))
        }
      }).catch(function(error) {
          throw (new Error(error))
      })
    })
  }
  async function deleteAdmin ({ ...adminInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(adminInfo)
    return getAdmin(adminInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      return auth.verifyIdToken(result.token).then((resp) => {
        if("moderator" == resp.role) {
          return auth
          .deleteUser(result.uid)
          .then(() => {
            return db.collection('admins').doc(docID)
                  .delete()
                  .then((respond) => { 
                  return respond
                  }).catch((error) => {
                  throw (new Error(error))
                  })
          })
          .catch((error) => {
            throw (new Error(error))
          });
        } else {
            throw (new Error("Permission Denied: not a moderator."))
        }
      }).catch(function(error) {
          throw (new Error(error))
      })
    })
  }
  async function update_alt ({ ...adminInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(adminInfo)
    return getAdmin(adminInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      if( validateToken(result.token, jwt).uid == result.id ) {
        return db.collection('admins').doc(docID).update({
          login: result.body.login,
          password: result.body.password,
          image: result.body.image,
          modifiedOn :result.body.modifiedOn
        }).catch((error) => {
          throw new Error(error)
        })
      } else {
          throw (new Error("Token does NOT match ID."))
      }
    })
  }
}
function getAdmin(admin) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve({ 
          id: admin.id,
          uid: admin.uid,
          body: {
            login: admin.login,
            password: admin.password ,
            newPassword: admin.newPassword,
            modifiedOn: admin.modifiedOn,
            password: admin.password,
            newPassword: admin.newPassword,
            mail: admin.mail,
            phoneNumber: admin.phoneNumber,
            active: admin.active
           },
          role: admin.role, 
          token: admin.token,
          refreshToken: admin.refreshToken
          });
          reject(new Error('Errr')); 
      }, 10);
  });
}
function getAdminToken(info, jwt){
  /**************** ENV secret key **************
//const secretKey = process.env.DM_KEY
*/

/**************** Static api root ***********/
//const secretKey = "iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAADoAMABAAAAAEAAAADAAAAANUh22IAAALgaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqQdKizAAAAK0lEQVQIHWNkY2b6z83NzcDExMTAxMbGxiAgIMDw/sNHBkZOVpb/IFGQIABmhgVx+33aWAAAAABJRU5ErkJggg=="
const secretKey ='iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAADoAMABAAAAAEAAAADAAAAANUh22IAAALgaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqQdKizAAAAK0lEQVQIHWNkY2b6z83NzcDExMTAxMbGxiAgIMDw/sNHBkZOVpb/IFGQIABmhgVx+33aWAAAAABJRU5ErkJggg=='
const token = jwt.sign(
  { uid: info.uid, id: info.id, mail: info.mail, role: info.role },secretKey,{ expiresIn: '24h' });
  return token
}

function validateToken(token, jwt){
  const secretKey ='iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAADoAMABAAAAAEAAAADAAAAANUh22IAAALgaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqQdKizAAAAK0lEQVQIHWNkY2b6z83NzcDExMTAxMbGxiAgIMDw/sNHBkZOVpb/IFGQIABmhgVx+33aWAAAAABJRU5ErkJggg=='
  const decoded = jwt.verify(token, secretKey);
  return decoded
}

function crypt(string, action, crypto) {
  const secretKey ='iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAADoAMABAAAAAEAAAADAAAAANUh22IAAALgaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqQdKizAAAAK0lEQVQIHWNkY2b6z83NzcDExMTAxMbGxiAgIMDw/sNHBkZOVpb/IFGQIABmhgVx+33aWAAAAABJRU5ErkJggg=='
  if (action === "e") {
    var mykey = crypto.createCipher('aes-128-cbc', secretKey);
    var mystr = mykey.update(string, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr
  } else if( action === "d" ) {
    var mykey = crypto.createDecipher('aes-128-cbc', secretKey);
    var mystr = mykey.update(string, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
  }
  else {
    throw new Error('Invalid Action.')
  }
  
}

