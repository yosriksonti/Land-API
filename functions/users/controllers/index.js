const { 
  addUser, 
  getUser, 
  updateUser, 
  updatePassword,
  loginUser,
  addReset,
  listUsers
} = require('../use-cases/index.js')
//const makeDeleteComment = require('./delete-comment'
const makePostUser = require('./post-user.js')
const makeFindUser = require('./find-user.js')
const makePutUser = require('./put-user.js')
const makePutPassword = require('./put-password.js')
const makeAuthUser = require('./auth-user.js')
const makePostReset = require('./post-reset.js')
const makeGetUsers = require('./get-users.js')

//const makePatchComment = require('./patch-comment'


//const deleteComment = makeDeleteComment({ removeComment })
const postUser = makePostUser({ addUser })
const findUser = makeFindUser({ getUser })
const putUser = makePutUser({ updateUser })
const putPassword = makePutPassword({ updatePassword })
const authUser = makeAuthUser({ loginUser })
const postReset = makePostReset({ addReset })
const getUsers = makeGetUsers({ listUsers })

//const patchComment = makePatchComment({ editComment })

const userController = Object.freeze({
  //deleteComment,Ò
  postUser,
  putUser,
  putPassword,
  findUser,
  authUser,
  postReset,
  getUsers
  //patchComment
})
 /**
 * User Controllers Main Entry
 * @requires userUseCase -User Use Cases
 * @requires makeFindUser -Find User Controller Maker 
 * @requires makeAuthUser -Auth Users Controller Maker
 * @requires makePostReset -Post Reset Controller Maker
 * @requires makePutUser -Put User Controller Maker
 * @requires makePutPassword -Put Password Controller Maker
 * @exports userController
 */
module.exports =  userController

