/**
 * Makes a Get Announce UC
 * @param {function} announcesDb -Announces Data-access
 * @exports makeListAnnounces 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeListAnnounces ({ announcesDb }) {
    return async function listAnnounces () {
      const announce = await announcesDb.findAll({
           
      })
      return announce;
    }
  }
  