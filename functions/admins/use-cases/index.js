const makeAddAdmin = require( './add-admin.js')
const makeGetAdmin = require( './get-admin.js')
const makeLoginAdmin = require( './login-admin.js')
const makeAddReset = require( './add-reset.js')
const makeListAdmins = require( './list-admins.js')
const makeRemoveAdmin = require( './remove-admin.js')


const {adminsDb} = require( '../data-access/index.js')

const addAdmin = makeAddAdmin({ adminsDb, })
const getAdmin = makeGetAdmin({ adminsDb })
const loginAdmin = makeLoginAdmin({ adminsDb })
const addReset = makeAddReset({ adminsDb })
const listAdmins = makeListAdmins({ adminsDb })
const removeAdmin = makeRemoveAdmin({ adminsDb })

const adminUseCase = Object.freeze({
  addAdmin,
  getAdmin,
  addReset,
  listAdmins,
  removeAdmin,
  loginAdmin,
})
/**
 * Admin Use Cases Main Entry
 * @requires makeGetAdmin -Get Admin UC Maker 
 * @requires makeAddAdmin -Add Admin UC Maker
 * @requires makeLoginAdmin -Login Admin UC Maker
 * @requires makeAddReset -Add Reset UC Maker
 * @requires makeUpdateAdmin -Update Admin UC Maker
 * @requires makeUpdatePassword -Update Password UC Maker
 * @exports adminUseCase
 */
module.exports =  adminUseCase

