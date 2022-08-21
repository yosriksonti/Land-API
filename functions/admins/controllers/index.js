const { 
  addAdmin, 
  getAdmin, 
  loginAdmin,
  addReset,
  listAdmins,
  removeAdmin,
} = require('../use-cases/index.js')
//const makeDeleteComment = require('./delete-comment'
const makePostAdmin = require('./post-admin.js')
const makeFindAdmin = require('./find-admin.js')
const makeAuthAdmin = require('./auth-admin.js')
const makePostReset = require('./post-reset.js')
const makeGetAdmins = require('./get-admins.js')
const makeDeleteAdmin = require('./delete-admin.js')

//const makePatchComment = require('./patch-comment'


//const deleteComment = makeDeleteComment({ removeComment })
const postAdmin = makePostAdmin({ addAdmin })
const findAdmin = makeFindAdmin({ getAdmin })
const authAdmin = makeAuthAdmin({ loginAdmin })
const postReset = makePostReset({ addReset })
const getAdmins = makeGetAdmins({ listAdmins })
const deleteAdmin = makeDeleteAdmin({ removeAdmin })


//const patchComment = makePatchComment({ editComment })

const adminController = Object.freeze({
  //deleteComment,Ò
  postAdmin,
  findAdmin,
  authAdmin,
  postReset,
  getAdmins,
  deleteAdmin,

  //patchComment
})
 /**
 * Admin Controllers Main Entry
 * @requires adminUseCase -Admin Use Cases
 * @requires makeFindAdmin -Find Admin Controller Maker 
 * @requires makeAuthAdmin -Auth Admins Controller Maker
 * @requires makePostReset -Post Reset Controller Maker
 * @requires makePutAdmin -Put Admin Controller Maker
 * @requires makePutPassword -Put Password Controller Maker
 * @exports adminController
 */
module.exports =  adminController
