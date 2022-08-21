/**
 * Makes an Delete Announce Controller
 * @param {function} removeAnnounce -Remove Announce UC 
 * @exports makeDeleteAnnounce 
 * @returns {function}  - Delete Announce Controller
 */
 module.exports =  function makeDeleteAnnounce ({ removeAnnounce }) {
    return async function deleteAnnounce (httpRequest) {
      try {
        const source = {} = httpRequest.body
        console.log(httpRequest.body)
        const announceInfo = httpRequest.body
        source.ip = httpRequest.ip
        source.browser = httpRequest.headers['Announce-Agent']
        if (httpRequest.headers['Referer']) {
          source.referrer = httpRequest.headers['Referer']
        }
        const posted = await removeAnnounce({
          announceInfo
        })
        return {
          headers: {
            'Content-Type': 'application/json',
            //'Last-Modified': new Date(posted.modifiedOn).toUTCString()
          },
          statusCode: 201,
          body: { posted }
        }
      } catch (e) {
        // TODO: Error logging
        console.log(e)
  
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 400,
          body: {
            error: e.message
          }
        }
      }
    }
  }
  