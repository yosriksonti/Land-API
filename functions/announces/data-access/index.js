const makeAnnouncesDb = require('./announces-db.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const keywordFilter = require('keyword-filter')
const { admin, firebase }  = require('../../config/database/index.js')
function makeDb () {
    return admin.firestore();
}
function makeAuth () {
    return admin.auth()
}
const announcesDb = makeAnnouncesDb({ makeDb, makeAuth, firebase, jwt, crypto, keywordFilter })
/**
 * Announce Data Access Main Entry
 * @requires makeAnnouncesDb -Get Announces DB Maker 
 * @requires jwt -JSON Web Token Module
 * @requires cyrpto -Crypting Module
 * @requires databaseService
 * @exports announceDataAccess
 */
const announceDataAccess = Object.freeze({
    announcesDb
})
module.exports =  announceDataAccess
