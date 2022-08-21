const {makeAdmin} = require('../admin/index.js')/**
 * Makes a Deactivate Admin UC
 * @requires adminService -Admin Service
 * @param {function} adminsDb -Admins Data-access
 * @exports makeDeactivateAdmin 
 * @returns {function}  - Deactivate Admin UC
 */
module.exports =  function makeDeactivateAdmin ({ adminsDb }) {
  return async function deactivateAdmin (...adminInfo) {
    const info = {action: "putAdmin"}
    Object.assign(info,adminInfo[0].adminInfo)
    const admin = makeAdmin(info)
    // const moderated = await handleModeration({ admin })
    return adminsDb.deactivate({
      active: false
    })
  }
}
