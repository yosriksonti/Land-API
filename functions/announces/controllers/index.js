const {
  removeAnnounce, 
  addAnnounce, 
  getAnnounce,
  listAnnounces,
  listUserAnnounces,
  updateAnnounce,
  updateVisibAnnounce,
  filterAnnounces
} = require('../use-cases/index.js')
//const makeDeleteComment = require('./delete-comment'
const makeDeleteAnnounce = require('./delete-announce.js')
const makePostAnnounce = require('./post-announce.js')
const makeFindAnnounce = require('./find-announce.js')
const makeGetAnnounces = require('./get-announces.js')
const makeGetUserAnnounces = require('./get-user-announces.js')
const makePutAnnounce = require('./put-announce.js')
const makePutVisibAnnounce = require('./put-visib-announce.js')
const makeSearchAnnounces = require('./search-announces.js')

//const makePatchComment = require('./patch-comment'


//const deleteComment = makeDeleteComment({ removeComment })
const deleteAnnounce = makeDeleteAnnounce({ removeAnnounce })
const postAnnounce = makePostAnnounce({ addAnnounce })
const findAnnounce = makeFindAnnounce({ getAnnounce })
const getAnnounces = makeGetAnnounces({ listAnnounces })
const getUserAnnounces = makeGetUserAnnounces({ listUserAnnounces })
const putAnnounce = makePutAnnounce({updateAnnounce})
const putVisibAnnounce = makePutVisibAnnounce({updateVisibAnnounce})
const searchAnnounces = makeSearchAnnounces({filterAnnounces})

//const patchComment = makePatchComment({ editComment })

const announceController = Object.freeze({
  deleteAnnounce,
  postAnnounce,
  findAnnounce,
  getAnnounces,
  getUserAnnounces,
  putAnnounce,
  putVisibAnnounce,
  searchAnnounces
  //patchComment
})
 /**
 * Announce Controllers Main Entry
 * @requires announceUseCase -Announce Use Cases
 * @requires makeFindAnnounce -Find Announce Controller Maker 
 * @requires makeAuthAnnounce -Auth Announces Controller Maker
 * @requires makePostReset -Post Reset Controller Maker
 * @requires makePutAnnounce -Put Announce Controller Maker
 * @requires makePutPassword -Put Password Controller Maker
 * @exports announceController
 */
module.exports =  announceController
