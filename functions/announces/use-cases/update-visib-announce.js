const { makeAnnounce } = require('../announce/index.js')
/**
 * Makes a Update announce UC
 * @requires announceService -announce Service
 * @param {function} announcesDb -announces Data-access
 * @exports makeUpdateannounce 
 * @returns {function}  - Update announce UC
 */
module.exports =  function makeUpdateVisibAnnounce ({ announcesDb }) {
  return async function updateVisibAnnounce (...announceInfo) {
    const info = {action: "putVisibAnnounce"}
    console.log(info)
    Object.assign(info,announceInfo[0].AnnounceInfo)
    const announce = makeAnnounce(info)
    // const moderated = await handleModeration({ announce })
    return announcesDb.updateVisibility({
      id: announce.getId(),
      visib: announce.getVisib(),
      date_update: announce.getDate_update(),
      token: announce.getToken()
    })
  }
}
