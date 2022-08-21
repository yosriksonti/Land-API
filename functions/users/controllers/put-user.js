/**
 * Makes an Put User Controller
 * @param {function} updateUser -Update User UC 
 * @exports makePutUser 
 * @returns {function}  - Put User Controller
 */
module.exports =  function makePutUser ({ updateUser }) {
    return async function putUser (httpRequest) {
      try {
        const source = {} = httpRequest.body
        console.log(httpRequest.body)
        const userInfo = httpRequest.body
        source.ip = httpRequest.ip
        source.browser = httpRequest.headers['User-Agent']
        if (httpRequest.headers['Referer']) {
          source.referrer = httpRequest.headers['Referer']
        }
        const posted = await updateUser({
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
  