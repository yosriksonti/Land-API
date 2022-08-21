const makeAddAnnounce = require( './add-announce.js')
const makeGetAnnounce = require( './get-announce.js')
const makeListAnnounces = require( './list-announces.js')
const makeListUserAnnounces = require( './list-user-announces.js')
const makeUpdateAnnounce = require( './update-announce.js')
const makeUpdateVisibAnnounce = require( './update-visib-announce.js')
const makeFilterAnnounces = require( './filter-announces.js')
const makeRemoveAnnounce = require( './remove-announce.js')
const {announcesDb} = require( '../data-access/index.js')

const addAnnounce = makeAddAnnounce({ announcesDb, })
const getAnnounce = makeGetAnnounce({ announcesDb })
const listAnnounces = makeListAnnounces({ announcesDb })
const listUserAnnounces = makeListUserAnnounces({ announcesDb })
const updateAnnounce = makeUpdateAnnounce({ announcesDb })
const updateVisibAnnounce = makeUpdateVisibAnnounce({ announcesDb })
const filterAnnounces = makeFilterAnnounces({announcesDb})
const removeAnnounce = makeRemoveAnnounce({announcesDb})
const announceUseCase = Object.freeze({
  removeAnnounce,
  addAnnounce,
  getAnnounce,
  listAnnounces,
  listUserAnnounces,
  updateAnnounce,
  updateVisibAnnounce,
  filterAnnounces
})
/**
 * Announce Use Cases Main Entry
 * @requires makeGetAnnounce -Get Announce UC Maker 
 * @requires makeAddAnnounce -Add Announce UC Maker
 * @requires makeLoginAnnounce -Login Announce UC Maker
 * @requires makeAddReset -Add Reset UC Maker
 * @requires makeUpdateAnnounce -Update Announce UC Maker
 * @requires makeUpdatePassword -Update Password UC Maker
 * @exports announceUseCase
 */
module.exports =  announceUseCase

