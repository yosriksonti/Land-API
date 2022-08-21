const { makeAnnounce } = require('../announce/index.js')
/**
 * Makes a Add Announce UC
 * @requires announceService -Announce Service
 * @param {function} announcesDb -Announces Data-access
 * @param {function} addNotification -Add Notification UC
 * @exports makeAddAnnounce 
 * @returns {function}  - Add Announce UC
 */
module.exports =  function makeAddAnnounce ({ announcesDb }) {
  return async function addAnnounce (info) {
    const uInfo = {action: "postAnnounce"}
    Object.assign(uInfo,info.announce)
    const announce = makeAnnounce(uInfo)
    return announcesDb.insert({
      titre: announce.getTitre(),
      date_cr: announce.getDate_cr(),
      date_update: announce.getDate_update(),
      description: announce.getDescription(),
      address: announce.getAddress(),
      size: announce.getSize(),
      image: announce.getImage(),
      visib: announce.getVisib(),
      userId: announce.getUserId(),
      files: announce.getFiles(),
      points: announce.getPoints()
    }).then((resp) => {
      return resp
    }).catch((error) => {
      throw new Error(error)
    })
  }
}
