/**
 * Makes an Put Announce Controller
 * @param {function} updateAnnounce -Update Announce UC 
 * @exports makePutAnnounce 
 * @returns {function}  - Put Announce Controller
 */
module.exports =  function makePutVisibAnnounce ({ updateVisibAnnounce }) {
    return async function putVisibAnnounce (httpRequest) {
      try {
        const source = {} = httpRequest.body
        console.log(httpRequest.body)
        const AnnounceInfo = httpRequest.body
        source.ip = httpRequest.ip
        source.browser = httpRequest.headers['Announce-Agent']
        if (httpRequest.headers['Referer']) {
          source.referrer = httpRequest.headers['Referer']
        }
        const posted = await updateVisibAnnounce({
          AnnounceInfo
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
  