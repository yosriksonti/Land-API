/**
 * Makes an Post Reset Controller
 * @param {function} addReset -Add Reset UC 
 * @exports makePostReset 
 * @returns {function}  - Post Reset Controller
 */
module.exports =  function makePostReset ({ addReset }) {
    return async function postReset (httpRequest) {
      try {
        const source = {}= httpRequest.body
        console.log(httpRequest.body)
        const userInfo = httpRequest.body
        source.ip = httpRequest.ip
        source.browser = httpRequest.headers['Reset-Agent']
        if (httpRequest.headers['Referer']) {
          source.referrer = httpRequest.headers['Referer']
        }
        const posted = await addReset({
          userInfo
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
  