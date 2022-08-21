/**
 * Makes an Find Admin Controller
 * @param {function} listAdmins -Get Admin UC 
 * @exports makeFindAdmin 
 * @returns {function}  - Find Admin Controller
 */
module.exports =  function makeFindAdmin ({ listAdmins }) {
    return async function findAdmin (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        console.log(httpRequest.params.id);
        const postAdmin = await listAdmins({
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
  