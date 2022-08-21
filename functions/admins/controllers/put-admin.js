/**
 * Makes an Put Admin Controller
 * @param {function} updateAdmin -Update Admin UC 
 * @exports makePutAdmin 
 * @returns {function}  - Put Admin Controller
 */
module.exports =  function makePutAdmin ({ updateAdmin }) {
    return async function putAdmin (httpRequest) {
      try {
        const source = {} = httpRequest.body
        console.log(httpRequest.body)
        const adminInfo = httpRequest.body
        source.ip = httpRequest.ip
        source.browser = httpRequest.headers['User-Agent']
        if (httpRequest.headers['Referer']) {
          source.referrer = httpRequest.headers['Referer']
        }
        const posted = await updateAdmin({
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
  