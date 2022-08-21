/**
 * Makes a Get Announce UC
 * @param {function} announcesDb -Announces Data-access
 * @exports makeFilterAnnounces 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeFilterAnnounces ({ announcesDb }) {
    return async function filterAnnounces ({keywords,date_cr}) {
      const announce = await announcesDb.filters({
           keywords,
           date_cr
      })
      return announce;
    }
  }
  