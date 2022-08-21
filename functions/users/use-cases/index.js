const makeAddUser = require('./add-user.js')
const makeGetUser = require('./get-user.js')
const makeUpdateUser = require('./update-user.js')
const makeUpdatePassword = require('./update-password.js')
const makeLoginUser = require('./login-user.js')
const makeAddReset = require('./add-reset.js')
const makeListUsers = require('./list-users.js')


const {usersDb} = require('../data-access/index.js')

const addUser = makeAddUser({ usersDb, })
const getUser = makeGetUser({ usersDb })
const updateUser = makeUpdateUser({ usersDb })
const updatePassword = makeUpdatePassword({ usersDb })
const loginUser = makeLoginUser({ usersDb })
const addReset = makeAddReset({ usersDb })
const listUsers = makeListUsers({ usersDb, })

const userUseCase = Object.freeze({
  addUser,
  getUser,
  updateUser,
  updatePassword,
  loginUser,
  addReset,
  listUsers
})
/**
 * User Use Cases Main Entry
 * @requires makeGetUser -Get User UC Maker 
 * @requires makeAddUser -Add User UC Maker
 * @requires makeLoginUser -Login User UC Maker
 * @requires makeAddReset -Add Reset UC Maker
 * @requires makeUpdateUser -Update User UC Maker
 * @requires makeUpdatePassword -Update Password UC Maker
 * @exports userUseCase
 */
module.exports =  userUseCase

