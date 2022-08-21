/**
 * Makes an Auth Admin Controller
 * @param {function} loginAdmin -Login Admin UC 
 * @exports makeAuthAdmin 
 * @returns {function}  - Auth Admin Controller
 */
module.exports = function makeAuthAdmin ({ loginAdmin }) {
    return async function authAdmin (httpRequest) {
      try {
        const source = {}= httpRequest.body
        console.log(httpRequest.body)
        const adminInfo = httpRequest.body
        source.ip = httpRequest.ip
        source.browser = httpRequest.headers['Admin-Agent']
        if (httpRequest.headers['Referer']) {
          source.referrer = httpRequest.headers['Referer']
        }
        const posted = await loginAdmin({
          adminInfo
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
  