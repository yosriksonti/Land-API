const makeUsersDb = require( './users-db.js')
const jwt = require( 'jsonwebtoken')
const crypto = require( 'crypto')
const { admin, firebase }  = require( '../../config/database/index.js')
function makeDb () {
    return admin.firestore();
}
function makeAuth () {
    return admin.auth()
}
const usersDb = makeUsersDb({ makeDb, makeAuth, firebase, jwt, crypto })
/**
 * User Data Access Main Entry
 * @requires makeUsersDb -Get Users DB Maker 
 * @requires jwt -JSON Web Token Module
 * @requires cyrpto -Crypting Module
 * @requires databaseService
 * @exports userDataAccess
 */
const userDataAccess = Object.freeze({
    usersDb
})
module.exports =  userDataAccess
