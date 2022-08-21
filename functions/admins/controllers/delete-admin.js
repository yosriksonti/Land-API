/**
 * Makes an Put Password Controller
 * @param {function} updatePassword -Update Password UC 
 * @exports makeDeleteAdmin 
 * @returns {function}  - Put Password Controller
 */
  module.exports =  function makeDeleteAdmin ({ removeAdmin }) {
    return async function deleteAdmin (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      const adminInfo = httpRequest.body
      try {
        console.log(adminInfo)
        const deleted = await removeAdmin({ ...adminInfo })
        return {
          headers,
          statusCode: deleted.deletedCount === 0 ? 404 : 200,
          body: { deleted }
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
  
  