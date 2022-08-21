/**
 * Makes an Find Announce Controller
 * @param {function} searchAnnounce -Search Announce UC 
 * @exports makeSearchAnnounces 
 * @returns {function}  - Find Announce Controller
 */
module.exports =  function makeSearchAnnounces ({ filterAnnounces }) {
    return async function searchAnnounces (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        console.log(httpRequest);
        const postAnnounce = await filterAnnounces({
            keywords: httpRequest.query.keywords,
            date_cr: httpRequest.query.date_cr
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
  