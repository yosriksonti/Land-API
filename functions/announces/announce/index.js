const buildMakeAnnounce = require ('./announce.js')
const buildMakePoint = require('./point.js')

const makePoint = buildMakePoint({})
const makeAnnounce = buildMakeAnnounce({makePoint})
const announceService = Object.freeze({
    makeAnnounce
})
/**
 * Announce Entity Main Entry
 * @requires buildMakeAnnounce -Announce Maker Builder
 * @exports announceService
 */
module.exports =  announceService
