const buildMakeAdmin = require('./admin.js')

const makeAdmin = buildMakeAdmin({})
const adminService = Object.freeze({
    makeAdmin
})
/**
 * Admin Entity Main Entry
 * @requires buildMakeWishlist -Wishlist Maker Builder
 * @requires buildMakeAchievement -Bought Maker Builder
 * @requires buildMakeCommunity -Community Maker Builder
 * @requires buildMakeAchievement -Achievement Maker Builder
 * @requires buildMakeAdmin -Admin Maker Builder
 * @exports adminService
 */
module.exports = adminService
