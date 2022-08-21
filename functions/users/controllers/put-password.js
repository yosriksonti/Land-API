/**
 * Makes an Put Password Controller
 * @param {function} updatePassword -Update Password UC 
 * @exports makePutPassword 
 * @returns {function}  - Put Password Controller
 */
module.exports =  function makePutPassword ({ updatePassword }) {
    return async function putPassword (httpRequest) {
      try {
        const source = {} = httpRequest.body
        console.log(httpRequest.body)
        const userInfo = httpRequest.body
        source.ip = httpRequest.ip
        source.browser = httpRequest.headers['User-Agent']
        if (httpRequest.headers['Referer']) {
          source.referrer = httpRequest.headers['Referer']
        }
        const posted = await updatePassword({
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
  