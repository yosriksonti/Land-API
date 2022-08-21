/**
 * Makes an Find Announce Controller
 * @param {function} getUserAnnounce -GetUser Announce UC 
 * @exports makeGetUserAnnounces 
 * @returns {function}  - Find Announce Controller
 */
module.exports =  function makeGetUserAnnounces ({ listUserAnnounces }) {
    return async function getUserAnnounces (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        console.log(httpRequest.params.userId);
        const userId = httpRequest.params.userId
        const postAnnounce = await listUserAnnounces({
          userId
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
  