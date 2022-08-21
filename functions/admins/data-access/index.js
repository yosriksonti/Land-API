const  makeAdminsDb = require( './admins-db.js')
const  jwt = require( 'jsonwebtoken')
const  crypto = require( 'crypto')
const  { admin, firebase }  = require( '../../config/database/index.js')
function makeDb () {
    return admin.firestore();
}
function makeAuth () {
    return admin.auth()
}
const adminsDb = makeAdminsDb({ makeDb, makeAuth, firebase, jwt, crypto })
/**
 * Admin Data Access Main Entry
 * @requires makeAdminsDb -Get Admins DB Maker 
 * @requires jwt -JSON Web Token Module
 * @requires cyrpto -Crypting Module
 * @requires databaseService
 * @exports adminDataAccess
 */
const adminDataAccess = Object.freeze({
    adminsDb
})
module.exports =  adminDataAccess
