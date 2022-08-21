const { makeAdmin } = require( '../admin/index.js')
/**
 * Makes a Add Admin UC
 * @requires adminService -Admin Service
 * @param {function} adminsDb -Admins Data-access
 * @param {function} addNotification -Add Notification UC
 * @exports makeAddAdmin 
 * @returns {function}  - Add Admin UC
 */
module.exports =  function makeAddAdmin ({ adminsDb }) {
  return async function addAdmin (info) {
    const uInfo = {action: "postAdmin"}
    Object.assign(uInfo,info.admin)
    const admin = makeAdmin(uInfo)
    return adminsDb.insert({
      mail: admin.getMail(),
      login: admin.getLogin(),
      password: admin.getPassword(),
      phoneNumber: admin.getPhoneNumber(),
      role: admin.getRole(),
    }).then((resp) => {
      return resp
    }).catch((error) => {
      throw new Error(error)
    })
  }
}
