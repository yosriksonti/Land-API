const buildMakeUser = require('./user.js')

const makeUser = buildMakeUser({})
const userService = Object.freeze({
    makeUser
})
/**
 * User Entity Main Entry
 * @requires buildMakeWishlist -Wishlist Maker Builder
 * @requires buildMakeAchievement -Bought Maker Builder
 * @requires buildMakeCommunity -Community Maker Builder
 * @requires buildMakeAchievement -Achievement Maker Builder
 * @requires buildMakeUser -User Maker Builder
 * @exports userService
 */
module.exports =  userService
