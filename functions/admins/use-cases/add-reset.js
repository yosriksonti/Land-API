const { makeAdmin } = require ('../admin/index.js')
/**
 * Makes a Add Reset UC
 * @requires adminService -Reset Service
 * @param {function} adminsDb -Admins Data-access
 * @exports makeAddReset 
 * @returns {function}  - Add Reset UC
 */
module.exports =  function makeAddReset ({ adminsDb }) {
  return async function addReset (...adminInfo) {
    const info = {action: "postReset"}
    Object.assign(info,adminInfo[0].adminInfo)
    const admin = makeAdmin(info)
    // const moderated = await handleModeration({ admin })
    return adminsDb.reset({
      email: admin.getEmail()
    })
  }
}
