/**
 * Makes a Get Announce UC
 * @param {function} announcesDb -Announces Data-access
 * @exports makeGetAnnounce 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeGetAnnounce ({ announcesDb }) {
    return async function getAnnounce ({Id} = {}) {
      const announce = await announcesDb.findById({
          Id 
      })
      return announce;
    }
  }
  