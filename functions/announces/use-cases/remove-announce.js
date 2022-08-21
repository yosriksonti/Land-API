const { makeAnnounce } = require('../announce/index.js')

/**
 * Makes a remove Announce UC
 * @param {function} announcesDb -Announces Data-access
 * @exports makeremoveAnnounce 
 * @returns {function}  - remove Community UC
 */
 module.exports =  function makeremoveAnnounce ({ announcesDb }) {
    return async function removeAnnounce ({announceInfo} = {}) {
      const info = {action: "deleteAnnounce"}
      console.log(info)
      Object.assign(info,announceInfo)
      const announce = makeAnnounce(info)
      // const moderated = await handleModeration({ announce })
      return announcesDb.deleteById({
        id: announce.getId(),
        token: announce.getToken()
      })
    }
  }
  