const { makeAnnounce } = require('../announce/index.js')
/**
 * Makes a Update announce UC
 * @requires announceService -announce Service
 * @param {function} announcesDb -announces Data-access
 * @exports makeUpdateannounce 
 * @returns {function}  - Update announce UC
 */
module.exports =  function makeUpdateAnnounce ({ announcesDb }) {
  return async function updateAnnounce (...announceInfo) {
    const info = {action: "putAnnounce"}

    Object.assign(info,announceInfo[0].AnnounceInfo)
    console.log(announceInfo[0])
    const announce = makeAnnounce(info)
    // const moderated = await handleModeration({ announce })
    return announcesDb.update({
      id: announce.getId(),
      titre: announce.getTitre(),
      description: announce.getDescription(),
      address: announce.getAddress(),
      size: announce.getSize(),
      rubriqueId : announce.getRubriqueId(),
      image: announce.getImage(),
      date_update : announce.getDate_update(),
      token: announce.getToken(),
      files: announce.getFiles(),
      points: announce.getPoints()

    })
  }
}
