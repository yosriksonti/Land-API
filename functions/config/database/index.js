const firebase = require('firebase')
const admin = require('firebase-admin')
require('firebase/storage/dist/index.cjs.js')
const serviceAccount = require('./ServiceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
var firebaseConfig = {
    databaseURL: "https://land-77c70.firebaseio.com",
    apiKey: "AIzaSyAMh1nfbTsE6-SXuBDTB1d8bKskwyRAXQQ",
    authDomain: "land-77c70.firebaseapp.com",
    projectId: "land-77c70",
    storageBucket: "land-77c70.appspot.com",
    messagingSenderId: "943361490454",
    appId: "1:943361490454:web:2eea847bc87fe7fd697f37",
    measurementId: "G-137QXBYLD2"
  };
  firebase.initializeApp(firebaseConfig)
const databaseService = {
    admin,
    firebase
}
/**
 * DataBase Main Entry
 * @requires firebase -Firebase Module 
 * @requires admin -Firebase Admin Module
 * @requires serviceAccount -Account Service
 * @exports databaseService 
 */
module.exports =  databaseService
