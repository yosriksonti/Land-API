/**
 * Makes an Find User Controller
 * @param {function} listUsers -Get User UC 
 * @exports makeFindUser 
 * @returns {function}  - Find User Controller
 */
module.exports =  function makeFindUser ({ listUsers }) {
    return async function findUser (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        console.log(httpRequest.params.id);
        const postUser = await listUsers({
        })
        
        return {
          headers,
          statusCode: 200,
          body: postUser
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
  