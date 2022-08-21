/**
 * Makes an Post Announce Controller
 * @param {function} addAnnounce -Add Announce UC 
 * @exports makePostAnnounce 
 * @returns {function}  - Post Announce Controller
 */
module.exports =  function makePostAnnounce ({ addAnnounce }) {
  return async function postAnnounce (httpRequest) {
    try {
      const source = {}= httpRequest.body
      console.log(httpRequest.body)
      const announceInfo = httpRequest.body
      source.ip = httpRequest.ip
      source.browser = httpRequest.headers['Announce-Agent']
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
      }
      const posted = await addAnnounce(
        announceInfo
      )
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
