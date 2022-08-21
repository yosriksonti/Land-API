/**
 * Makes an Find Announce Controller
 * @param {function} getAnnounce -Get Announce UC 
 * @exports makeFindAnnounce 
 * @returns {function}  - Find Announce Controller
 */
module.exports =  function makeFindAnnounce ({ getAnnounce }) {
    return async function findAnnounce (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        console.log(httpRequest.params.id);
        const postAnnounce = await getAnnounce({
          Id: httpRequest.params.id
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
  