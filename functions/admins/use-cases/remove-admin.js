const {makeAdmin} = require('../admin/index.js')
/**
 * Makes a delete Admin UC
 * @requires adminService -Admin Service
 * @param {function} adminsDb -Admins Data-access
 * @param {function} addNotification -Add Notification UC
 * @exports makeAddAdmin 
 * @returns {function}  - Add Admin UC
 */
module.exports =  function makeDeleteAdmin ({ adminsDb }) {
  return async function deleteAdmin (info) {
    const uInfo = {action: "deleteAdmin"}
    Object.assign(uInfo,info.admin)
    const admin = makeAdmin(uInfo)
    return adminsDb.deleteAdmin({
      id: admin.getId(),
      uid: admin.getUid(),
      token: admin.getToken(),
    }).then((resp) => {
      return resp
    }).catch((error) => {
      throw new Error(error)
    })
  }
}
