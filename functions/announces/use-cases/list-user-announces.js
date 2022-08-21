/**
 * Makes a Get Announce UC
 * @param {function} announcesDb -Announces Data-access
 * @exports makeListUserAnnounces 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeListUserAnnounces ({ announcesDb }) {
    return async function listUserAnnounces ({userId}) {
      const announce = await announcesDb.findByUserId({
           userId
      })
      return announce;
    }
  }
  