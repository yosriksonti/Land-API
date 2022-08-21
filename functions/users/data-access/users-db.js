/**
 * Makes a Users Data Access
 * @param {function} makeDb -DataBase Connection Maker
 * @param {function} makeAuth -Admin Connection Maker
 * @param {function} firebase -Firebase Connection
 * @param {function} jwt -JSON Web Token Module
 * @param {function} crypto -Crypting Module
 * @exports makeUsersDb 
 * @returns {Object}  - Users Data Access Frozen Object
 */
module.exports =  function makeUsersDb ({ makeDb, makeAuth, firebase, jwt, crypto}) {
  return Object.freeze({
    findAll,
    findById,
    findByEmail,
    exists,
    insert,
    login,
    update,
    updatePassword,
    reset
  })
  async function findAll () {
    const db = makeDb()
    const data = [];
    const result = await db.collection('users').get().then(function(querySnapshot) {
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
    const result = await db.collection('users').doc(docID).get().then(function(doc) {
      if (doc.exists) {
        console.log(doc.id, " => ", doc.data());
        data.push({
        id: doc.id,
        body: doc.data()
        });
      } else {
          throw (new Error("User does NOT exist."))
      }
      
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    return data;
  }

  async function findByEmail (email) {
    const db = makeDb()
    var exists = false
    console.log(email);
    const result = await db.collection('users').where("email", "==", email).get().then(function(querySnapshot) {
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

  async function findLoginByEmail (email) {
    const db = makeDb()
    var exists = false
    console.log(email);
    const result = await db.collection('logins').where("email", "==", email).get().then(function(querySnapshot) {
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
  async function exists (email) {
    const db = makeDb()
    var exists = false
    console.log(email);
    const result = await db.collection('logins').where("email", "==", email).get().then(function(querySnapshot) {
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
  async function insert ({ ...userInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(userInfo)
    return getUser(userInfo).then((result) => {
      return firebase.auth().createUserWithEmailAndPassword(result.body.email, result.body.password).then((resp) => {
        return db.collection('users').add({
          name: result.body.name,
          surname: result.body.surname ,
          createdOn: result.body.createdOn,
          modifiedOn: result.body.modifiedOn,
          email: result.body.email,
          image: result.body.image,
          phoneNumber: result.body.phoneNumber,
          active: result.body.active,
          type: result.body.type
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

  async function insert_alt ({ ...userInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(userInfo)
    return getUser(userInfo).then((result) => {
      return exists(result.body.email).then(() => {
        return db.collection('users').add({
          name: result.body.name,
          surname: result.body.surname ,
          createdOn: result.body.createdOn,
          modifiedOn: result.body.modifiedOn,
          email: result.body.email,
          image: result.body.image,
          phoneNumber: result.body.phoneNumber,
          active: result.body.active
        }).then((resp) => {
          const password = crypt(userInfo.password, "e", crypto) 
          return db.collection('logins').add({
            email: userInfo.email,
            password: password,
            createdOn: userInfo.createdOn,
            modifiedOn: userInfo.modifiedOn,
            role: userInfo.role,
            uid: resp._path.segments[1]
          }).catch(function(error) {
              console.log(result.body.email)
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

  
  async function login ({...userInfo}) {
    return firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password).then(function(resp){
      return findByEmail(userInfo.email).then((result) => {
        if(result.body.active){   
          return firebase.auth().currentUser.getIdToken(true).then((token) => {
            return {
              id: result.id, 
              body: result.body, 
              token: token
            }
          })   
          
        }else {
          throw (new Error("This User is NOT active."))
        }
       }).catch(function(error) {
          throw (new Error(error))
       })
    }).catch(function(error) {
        throw (new Error(error))
    });
  }

  async function login_alt ({...userInfo}) {
      return findLoginByEmail(userInfo.email).then((resp) => {
        if(userInfo.password === crypt(resp.body.password, "d", crypto)){
          return findByEmail(userInfo.email).then((result) => {
            if(result.body.active){
              const token = getUserToken({id: resp.id, uid: result.id, email: resp.body.email, role: resp.body.role}, jwt)
              return {
                id: result.id,
                body: result.body, 
                token: token
              }
            } else {
              throw (new Error("This User is NOT active."))
            }
          }).catch((error) => {
            throw new Error("User does NOT exist.")
          }) 
        } else {
          throw new Error("Check your Credentials.")
        }           
      }).catch((error) => {
        throw new Error(error)
      })
    //catch ( auth )  
  }

  async function reset ({...userInfo}) {  
    const auth = firebase.auth()
    return getUser(userInfo).then((result) => {
      return auth.sendPasswordResetEmail(result.body.email).then(() => {
        return "Email Sent."
      }).catch(function(error) {
        throw new Error(error)
      })
    }).catch((error) => {
      throw new Error(error)
    })    
  }

  async function updatePassword ({...userInfo}) {  
    const auth = makeAuth()
    return getUser(userInfo).then((result) => {
      return firebase.auth().signInWithEmailAndPassword(result.body.email, result.body.password).then(function(){
        return auth.verifyIdToken(result.token).then((resp) => {
          if (resp.id === result.id){
            return auth.updateUser(resp.uid, {
              password: result.body.newPassword
            }).then(function(userRecord) {
              return userRecord.toJSON()
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
  async function updatePassword_alt ({...userInfo}) {  
    const db = makeDb()
    return getUser(userInfo).then((result) => {
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
  async function update ({ ...userInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(userInfo)
    return getUser(userInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      return auth.verifyIdToken(result.token).then((resp) => {
        if(result.id == resp.id) {
          return db.collection('users').doc(docID).update({
            name: result.body.name,
            surname: result.body.surname,
            image: result.body.image,
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
  async function update_alt ({ ...userInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(userInfo)
    return getUser(userInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      if( validateToken(result.token, jwt).uid == result.id ) {
        return db.collection('users').doc(docID).update({
          name: result.body.name,
          surname: result.body.surname,
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
function getUser(user) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve({ 
          id: user.id,
          body: {
            name: user.name,
            surname: user.surname ,
            createdOn: user.createdOn,
            modifiedOn: user.modifiedOn,
            password: user.password,
            newPassword: user.newPassword,
            email: user.email,
            image: user.image,
            phoneNumber: user.phoneNumber,
            wishlists: user.wishlists,
            bought: user.bought,
            subscriptions: user.subscriptions,
            subscriptionToken: user.subscriptionToken,
            communities: user.communities,
            achievements: user.achievements,
            liked: user.liked,
            active: user.active,
            type: user.type
           },
          role: user.role, 
          token: user.token,
          refreshToken: user.refreshToken
          });
          reject(new Error('Errr')); 
      }, 10);
  });
}
function getUserToken(info, jwt){
  /**************** ENV secret key **************
//const secretKey = process.env.DM_KEY
*/

/**************** Static api root ***********/
//const secretKey = "iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAADoAMABAAAAAEAAAADAAAAANUh22IAAALgaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqQdKizAAAAK0lEQVQIHWNkY2b6z83NzcDExMTAxMbGxiAgIMDw/sNHBkZOVpb/IFGQIABmhgVx+33aWAAAAABJRU5ErkJggg=="
const secretKey ='iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAADoAMABAAAAAEAAAADAAAAANUh22IAAALgaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqQdKizAAAAK0lEQVQIHWNkY2b6z83NzcDExMTAxMbGxiAgIMDw/sNHBkZOVpb/IFGQIABmhgVx+33aWAAAAABJRU5ErkJggg=='
const token = jwt.sign(
  { uid: info.uid, id: info.id, email: info.email, role: info.role },secretKey,{ expiresIn: '24h' });
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

