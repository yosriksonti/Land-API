/**
 * Makes an Post Admin Controller
 * @param {function} addAdmin -Add Admin UC 
 * @exports makePostAdmin 
 * @returns {function}  - Post Admin Controller
 */
module.exports =  function makePostAdmin ({ addAdmin }) {
  return async function postAdmin (httpRequest) {
    try {
      const source = {}= httpRequest.body
      console.log(httpRequest.body)
      const adminInfo = httpRequest.body
      source.ip = httpRequest.ip
      source.browser = httpRequest.headers['User-Agent']
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
      }
      const posted = await addAdmin(
        adminInfo
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
