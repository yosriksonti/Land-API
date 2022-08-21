/**
 * Makes an Post User Controller
 * @param {function} addUser -Add User UC 
 * @exports makePostUser 
 * @returns {function}  - Post User Controller
 */
module.exports =  function makePostUser ({ addUser }) {
  return async function postUser (httpRequest) {
    try {
      const source = {}= httpRequest.body
      console.log(httpRequest.body)
      const userInfo = httpRequest.body
      source.ip = httpRequest.ip
      source.browser = httpRequest.headers['User-Agent']
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
      }
      const posted = await addUser(
        userInfo
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
