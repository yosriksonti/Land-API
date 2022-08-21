/**
 * Makes an Find Admin Controller
 * @param {function} getAdmin -Get Admin UC 
 * @exports makeFindAdmin 
 * @returns {function}  - Find Admin Controller
 */
module.exports =  function makeFindAdmin ({ getAdmin }) {
    return async function findAdmin (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        console.log(httpRequest.params.id);
        const postAdmin = await getAdmin({
          Id: httpRequest.params.id
        })
        
        return {
          headers,
          statusCode: 200,
          body: postAdmin
        }
      } catch (e) {
        // TODO: Error logging
        console.log(e)
        return {
          headers,
          statusCode: 400,
          body: {
            error: e.message
          }
        }
      }
    }
  }
  