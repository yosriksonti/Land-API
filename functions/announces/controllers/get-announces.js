/**
 * Makes an Find Announce Controller
 * @param {function} getAnnounce -Get Announce UC 
 * @exports makeGetAnnounces 
 * @returns {function}  - Find Announce Controller
 */
module.exports =  function makeGetAnnounces ({ listAnnounces }) {
    return async function getAnnounces (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        console.log(httpRequest.params.id);
        const postAnnounce = await listAnnounces({
        })
        
        return {
          headers,
          statusCode: 200,
          body: postAnnounce
        }
      } catch (e) {
        // TODO: Error logging
        console.log(e)
        return {
          headers,
          statusCode: 400,
          body: {
            error: e.message
          }
        }
      }
    }
  }
  